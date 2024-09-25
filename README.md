<img src="https://upload.wikimedia.org/wikipedia/commons/e/ee/Ufabc_logo.png" width="75"/>

## Universidade Federal do ABC  
## Projeto de Graduação em Computação (PGC) - Orientador: Prof. Dr. Carlos Alberto Kamienski - agosto de 2023  

## NOVAS ARQUITETURAS DE DADOS E SUAS PERSPECTIVAS  

## Solarié  

<img src="https://github.com/lima-renan/solarie/blob/main/arquitetura/datamesh-solarie-solucao.png" width="1500"/>

## Renan Ferreira Lima  
GitHub: lima-renan  
LinkedIn: [linkedin.com/in/renanflimabr](https://www.linkedin.com/in/renanflimabr)
Medium: [Renan F. Lima](https://medium.com/@flima.renan)

### Repositório com os códigos-fonte da aplicação desenvolvida para complementar o que foi estudado na monografia. O tema central do Projeto são as Novas Arquiteturas de Dados, em especial, o Data Mesh.

### A aplicação foi denominada de Solarié, sendo o frontend baseado no template Eyesome desenvolvido pela usuária do Github Sandhya1007: https://github.com/SandhyaR1007/eyesome-react

### Para o backend, utilizou-se o template mern-auth-server, disponibilizado pelo usuário do Github collegewap: https://github.com/collegewap/mern-auth-server.

### O diretório `arquitetura/` contém os desenhos e detalhes das tecnologias utilizadas.  

### O diretório `catalog/` inclui scripts e códigos relacionados ao catálogo de dados.  

### Os diretórios `frontend/` e `backend/` contêm o código relacionado às interfaces front e back da aplicação.  

### O diretório `relatorio/` inclui a monografia em formato PDF.  

---

## Requisitos para execução

Para rodar o projeto, é necessário:

1. Docker e Docker Compose instalados: [Instalação Docker](https://docs.docker.com/get-docker/)
2. Executar o Makefile através do comando Make [Make](https://www.gnu.org/software/make/manual/make.html)
3. Usar processador com arquitetura amd64 e no min. dual core, min. de 8GB de RAM, min. de 32GB livres de disco.

---

## Instruções para execução do projeto via Docker

Foi adicionado um `Makefile` para automatizar o processo de execução do projeto e subir todas as estruturas do Solarié.

### Passos para execução:

1. **Clonar o repositório e entrar no diretório do projeto**:
   ```bash
        git clone https://github.com/lima-renan/solarie.git
        cd solarie
   ```

2. **Executar o projeto utilizando o Makefile**:
    ```bash
        make build
    ```

    - Isso irá:

        - Copiar o arquivo env.txt para o arquivo .env dentro do container.
        - Iniciar os containers do Data Mesh e do DataHub utilizando docker-compose.
        - Restaurar os dados do DataHub conforme foi desenvolvido no projeto.
3. **Iniciar e parar os containers:**:
    - Para iniciar os containers que já foram criados:
    ```bash
        make start
    ```

     - Para parar os containers:
    ```bash
        make stop
    ```
---

## Limpeza do ambiente

### Para remover os objetos docker criados:
    ```bash
        make clean
    ```
---

## Endpoints da aplicação
    - O endpoint principal do Solarié está disponível em: http://localhost:3000.
    
    ### Serviços e Endpoints

| Serviço                  | Container Name       | Endpoint Público                | Porta Interna |
|--------------------------|----------------------|----------------------------------|---------------|
| App (Frontend)           | app                  | http://localhost:3000           | 3000          |
| Auth Server              | auth-server          | http://localhost:8082           | 8081          |
| User MongoDB             | user-mongodb         | mongodb://localhost:27017       | 27017         |
| Cart MongoDB             | cart-mongodb         | mongodb://localhost:27018       | 27017         |
| Product MongoDB          | product-mongodb      | mongodb://localhost:27019       | 27017         |
| Product MongoDB Seed     | product-mongo-seed   | N/A                              | N/A           |
| Category MongoDB Seed    | category-mongo-seed  | N/A                              | N/A           |
| MinIO                    | minio                | http://localhost:9000 (S3 API), http://localhost:9001 (Console) | 9000, 9001   |
| PostgreSQL               | postgres             | postgresql://localhost:5432      | 5432          |
| Airflow DB               | airflow_db           | postgresql://localhost:5433      | 5432          |
| Random Data Generator     | data_generator       | N/A                              | N/A           |
| MySQL (DataHub)           | mysql                | mysql://localhost:3306           | 3306          |
| Airflow Scheduler         | airflow_scheduler    | N/A                              | 8793          |
| Airflow Webserver         | airflow_webserver    | http://localhost:8087           | 8080          |
| Trino Coordinator         | trino                | http://localhost:8085           | 8080          |
| Trino Worker              | trino-worker         | N/A                              | N/A           |
| Jupyter Lab               | jupyter_lab          | http://localhost:8888           | 8888          |
| PostgreSQL (Hive Metastore)    | metastore-db      | mysql://localhost:5434          | 5432         |
| Hive Metastore            | hive-metastore       | thrift://localhost:9083         | 9083          |
| DBeaver (CloudBeaver)    | dbeaver              | http://localhost:8978           | 8978          |
| Kafka Broker              | broker               | http://localhost:9092           | 9092          |
| DataHub Actions           | datahub-actions      | N/A                              | N/A           |
| DataHub Frontend (React) | datahub-frontend-react| http://localhost:9002           | 9002          |
| DataHub GMS              | datahub-gms         | http://localhost:8080           | 8080          |
| DataHub Upgrade           | datahub-upgrade      | N/A                              | N/A           |
| Elasticsearch            | elasticsearch        | http://localhost:9200           | 9200          |
| Schema Registry           | schema-registry      | http://localhost:8081           | 8081          |
| Zookeeper                | zookeeper            | http://localhost:2181           | 2181          |

## Credenciais e Usuários

As credenciais e usuários utilizados estão disponíveis no arquivo env.txt ou então nos respectivos docker-compose (docker-compose.DataMesh.yml, catalog/docker-compose.DataHub.yml)

