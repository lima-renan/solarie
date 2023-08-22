from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from datetime import datetime
from pymongo import MongoClient
import json
import psycopg2

default_args = {
    'owner': 'vendas',
    'start_date': datetime(2023, 8, 14),
    'retries': 1,
}

# Conexão com PostgreSQL
postgres_connection = {
    "host": "172.21.0.10",
    "port": 5432,
    "database": "main",
    "user": "poc",
    "password": "user_password"
}

def create_indicators_table_if_not_exists(conn):

    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS dadosDaWishlist (
            id SERIAL PRIMARY KEY,
            indicator_name VARCHAR(255) NOT NULL,
            label TEXT NOT NULL,
            data JSONB NOT NULL
        )
    """)
    conn.commit()
    cur.close()


def aggregate_and_save_to_postgres():
    # Conectando ao MongoDB usando a URI fornecida
    connection_string = "mongodb://root:toor@172.21.0.3/wishlist_mesh"
    client = MongoClient(connection_string)
    db = client.get_database()

      # Indicadores
    pipeline_category_count = [
        {
            "$group": {
                "_id": "$products.category",
                "productCount": {"$sum": 1}
            }
        }
    ]
    result_category_count = list(db.wishlists.aggregate(pipeline_category_count))

    pipeline_brand_count = [
        {
            "$group": {
                "_id": "$products.brand",
                "productCount": {"$sum": 1}
            }
        }
    ]
    result_brand_count = list(db.wishlists.aggregate(pipeline_brand_count))

    pipeline_gender_count = [
        {
            "$group": {
                "_id": "$products.gender",
                "productCount": {"$sum": 1}
            }
        }
    ]
    result_gender_count = list(db.wishlists.aggregate(pipeline_gender_count))

    pipeline_average_price_by_category = [
        {
            "$group": {
                "_id": "$products.category",
                "averagePrice": {"$avg": "$products.price"}
            }
        }
    ]
    result_average_price_by_category = list(db.wishlists.aggregate(pipeline_average_price_by_category))

    pipeline_total_quantity_by_category = [
        {
            "$unwind": "$products"
        },
        {
            "$group": {
                "_id": "$products.category",
                "totalQuantity": {"$sum": "$products.quantity"}
            }
        }
    ]
    result_total_quantity_by_category = list(db.wishlists.aggregate(pipeline_total_quantity_by_category))

    client.close()

    # Estabelecer conexão com PostgreSQL
    conn = psycopg2.connect(**postgres_connection)

    # Verificar e criar as tabelas de indicadores, se necessário
    create_indicators_table_if_not_exists(conn)

    cur = conn.cursor()


    # Criar um dicionário para armazenar os resultados com labels
    all_results = {
        "product_count_by_category": {
            "label": "Contagem de Produtos por Categoria",
            "data": result_category_count
        },
        "product_count_by_brand": {
            "label": "Contagem de Produtos por Marca",
            "data": result_brand_count
        },
        "product_count_by_gender": {
            "label": "Contagem de Produtos por Gênero",
            "data": result_gender_count
        },
        "average_price_by_category": {
            "label": "Média de Preço por Categoria",
            "data": result_average_price_by_category
        },
        "total_quantity_by_category": {
            "label": "Quantidade Total Disponível por Categoria",
            "data": result_total_quantity_by_category
        },
    }

    for indicator_name, indicator_data in all_results.items():
        label = indicator_data['label']
        data = json.dumps(indicator_data['data'])
        cur.execute("INSERT INTO dadosDaWishlist (indicator_name, label, data) VALUES (%s, %s, %s)",
                    (indicator_name, label, data))

    conn.commit()
    cur.close()

dag = DAG(
    'mongo_db_aggregation_wishlist_postgres_dag',
    default_args=default_args,
    schedule_interval=None,
    catchup=False,
)

task_aggregate_and_save = PythonOperator(
    task_id='aggregate_and_save_task',
    python_callable=aggregate_and_save_to_postgres,
    dag=dag,
)

task_aggregate_and_save
