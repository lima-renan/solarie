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
from airflow.utils.dates import days_ago

default_args = {
    'owner': 'produtos',
    'start_date': datetime(2023, 8, 14),
    'retries': 1,
}

#gera os arquivos JSON
def generate_indicator_json(name, indicators, minio_client, config):

    indicators_list = []

    for item in indicators:
        formatted_item = {
            "indicator": name,
            "group_indicator": item["_id"],
            "value_indicator": item["value"]
        }
        indicators_list.append(formatted_item)

    # Serializa a lista de indicadores como uma string JSON
    json_data = '\n'.join([json.dumps(ind, ensure_ascii=False) for ind in indicators_list])
    data = BytesIO(json_data.encode('utf-8'))

    # Cria um arquivo temporário
    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        temp_file.write(data.getvalue())
        temp_file_path = temp_file.name

    if not minio_client.bucket_exists(config["dest_bucket"]):
        minio_client.make_bucket(config["dest_bucket"])

    # Carrega arquivo com o nome do indicador
    minio_client.fput_object(config["dest_bucket"], "indicator_" + name + ".json", temp_file_path)


    # Remove o arquivo temporário
    os.remove(temp_file_path)

generate_indicator_json


def aggregate_and_save_to_minio():
    # Conectando ao MongoDB usando a URI fornecida
    connection_string = "mongodb://root:toor@172.21.0.2/product_mesh"
    client = MongoClient(connection_string)
    db = client.get_database()

    # Contagem de Produtos por Categoria:
    pipeline_product_count_by_brand = [
        {
            "$group": {
                "_id": "$category",
                "value": {"$sum": 1}
            }
        }
    ]

    result_product_count_by_brand = list(db.products.aggregate(pipeline_product_count_by_brand))

    # Contagem de Produtos por Marca:
    pipeline_product_count_by_category = [
        {
            "$group": {
                "_id": "$brand",
                "value": {"$sum": 1}
            }
        }
    ]

    result_product_count_by_category = list(db.products.aggregate(pipeline_product_count_by_category))

     # Contagem de Produtos por Gênero:
    pipeline_product_count_by_gender = [
        {
            "$group": {
                "_id": "$gender",
                "value": {"$sum": 1}
            }
        }
    ]

    result_product_count_by_gender = list(db.products.aggregate(pipeline_product_count_by_gender))

    # Média de Preço por Categoria:
    pipeline_average_price_by_category = [
        {
            "$group": {
                "_id": "$category",
                "value": {"$avg": "$price"}
            }
        }
    ]
    result_average_price_by_category = list(db.products.aggregate(pipeline_average_price_by_category))

    # Quantidade Total Disponível por Categoria:
    pipeline_total_quantity_by_category = [
        {
            "$group": {
                "_id": "$category",
                "value": {"$sum": "$quantity"}
            }
        }
    ]
    result_total_quantity_by_category = list(db.products.aggregate(pipeline_total_quantity_by_category))

    # Classificação Média por Gênero
    pipeline_average_rating_by_gender = [
        {
            "$group": {
                "_id": "$gender",
                "value": {"$avg": "$rating"}
            }
        }
    ]
    result_average_rating_by_gender = list(db.products.aggregate(pipeline_average_rating_by_gender))

    # Produtos em Tendência por Categoria:
    pipeline_trending_count_by_category = [
        {
            "$match": {"trending": True},
        },
        {
            "$group": {
                "_id": "$category",
                "value": {"$sum": 1}
            }
        }
    ]
    result_trending_count_by_category = list(db.products.aggregate(pipeline_trending_count_by_category))

    client.close()

    config = {
        "dest_bucket":"dadosdeprodutos/json",
        "object_name":"indicadoresDeProdutos.json",
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


    generate_indicator_json("product_count_by_brand", result_product_count_by_brand, minio_client, config)
    generate_indicator_json("product_count_by_category", result_product_count_by_category, minio_client, config)
    generate_indicator_json("product_count_by_gender", result_product_count_by_gender, minio_client, config)
    generate_indicator_json("average_price_by_category", result_average_price_by_category, minio_client, config)
    generate_indicator_json("total_quantity_by_category", result_total_quantity_by_category, minio_client, config)
    generate_indicator_json("average_rating_by_gender", result_average_rating_by_gender, minio_client, config)
    generate_indicator_json("trending_count_by_category", result_trending_count_by_category, minio_client, config)

   
dag = DAG(
    'mongo_db_aggregation_products_minio_dag',
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