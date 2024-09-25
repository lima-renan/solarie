from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from datetime import datetime
from pymongo import MongoClient
import json
from minio import Minio
from minio.error import S3Error
import urllib3
from io import BytesIO
import tempfile
import os

default_args = {
    'owner': 'clientes',
    'start_date': datetime(2023, 8, 14),
    'retries': 1,
}

def aggregate_and_save_to_minio():
    # Conectando ao MongoDB usando a URI fornecida
    connection_string = "mongodb://root:toor@172.21.0.5/user_mesh"
    client = MongoClient(connection_string)
    db = client.get_database()

    # Agregando os dados por ano de nascimento e gênero
    pipeline = [
        {
            "$group": {
                "_id": {
                    "yearBday": "$yearBday",
                    "gender": "$gender"
                },
                "count": {"$sum": 1}
            }
        }
    ]
    result = list(db.users.aggregate(pipeline))

    client.close()

    # Formatando o resultado no formato desejado
    formatted_result = []
    for item in result:
        formatted_item = {
            "_id": {
                "yearBday": item["_id"]["yearBday"],
                "gender": item["_id"]["gender"]
            },
            "count": item["count"]
        }
        formatted_result.append(formatted_item)

    config = {
        "dest_bucket":"dadosdeclientes/json",
        "object_name":"estratificacaoDeClientes.json",
        "minio_endpoint":"172.21.0.9:9000",
        "minio_username": "minio_user",
        "minio_password": "minio_password",
    }

# Since we are using self-signed certs we need to disable TLS verification
    http_client = urllib3.PoolManager(cert_reqs='CERT_NONE')
    urllib3.disable_warnings()


    # Salvando o resultado no MinIO como um arquivo JSON
    minio_client = Minio(config["minio_endpoint"],
               secure=False,
               access_key=config["minio_username"],
               secret_key=config["minio_password"],
               http_client = http_client
               )
    
    json_data = "\n".join(json.dumps(item, ensure_ascii=False) for item in formatted_result)
    data = BytesIO(json_data.encode('utf-8'))

    # Criar um arquivo temporário para escrever o conteúdo do BytesIO
    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        temp_file.write(data.getvalue())
        temp_file_path = temp_file.name

    # Verificar se o bucket já existe
    if not minio_client.bucket_exists(config["dest_bucket"]):
        # Criar o bucket se ele não existir
        minio_client.make_bucket(config["dest_bucket"])

    # Enviar o arquivo temporário para o MinIO
    minio_client.fput_object(config["dest_bucket"], config["object_name"], temp_file_path)

    # Remover o arquivo temporário após a gravação
    os.remove(temp_file_path)

dag = DAG(
    'mongo_db_aggregation_users_minio_dag',
    default_args=default_args,
    schedule_interval=None,
    catchup=False,
)

task_aggregate_and_save = PythonOperator(
    task_id='aggregate_and_save_task',
    python_callable=aggregate_and_save_to_minio,
    dag=dag,
)

task_aggregate_and_save
