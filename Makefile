# Variáveis para os arquivos docker-compose
UID := $(shell id -u)
GID := $(shell id -g)
DATAMESH_COMPOSE = docker-compose.DataMesh.yml
DATAHUB_COMPOSE = catalog/docker-compose.DataHub.yml
VERSION := v0.14.1  # Versão padrão do DataHub
IMAGE := acryldata/datahub-upgrade:$(VERSION)
CONTAINER_NAME := datahub-upgrade-script

# Construir e rodar os containers do Data Mesh e DataHub
build:
	@echo "Gerando .env a partir do env.txt..."
	@if [ -f env.txt ]; then \
		cp env.txt .env; \
		echo "Arquivo .env gerado com sucesso."; \
	else \
		echo "Arquivo env.txt não encontrado."; \
		exit 1; \
	fi
	@echo "Fazendo Download dos Drivers do Hive..."
	@if [ ! -d volumes/hive/drivers ]; then \
		mkdir -p volumes/hive/drivers; \
		echo "Diretório volumes/hive/drivers criado."; \
	else \
		echo "Diretório volumes/hive/drivers já existe."; \
	fi
	@if [ ! -f volumes/hive/drivers/aws-java-sdk-bundle-1.11.1026.jar ]; then \
		wget https://repo1.maven.org/maven2/com/amazonaws/aws-java-sdk-bundle/1.11.1026/aws-java-sdk-bundle-1.11.1026.jar; \
		mv aws-java-sdk-bundle-1.11.1026.jar volumes/hive/drivers/; \
	else \
		echo "Driver aws-java-sdk-bundle já existe."; \
	fi
	@if [ ! -f volumes/hive/drivers/hadoop-aws-3.3.2.jar ]; then \
		wget https://repo1.maven.org/maven2/org/apache/hadoop/hadoop-aws/3.3.2/hadoop-aws-3.3.2.jar; \
		mv hadoop-aws-3.3.2.jar volumes/hive/drivers/; \
	else \
		echo "Driver hadoop-aws já existe."; \
	fi
	@if [ ! -f volumes/hive/drivers/postgresql-42.5.1.jar ]; then \
		wget https://repo1.maven.org/maven2/org/postgresql/postgresql/42.5.1/postgresql-42.5.1.jar; \
		mv postgresql-42.5.1.jar volumes/hive/drivers/; \
	else \
		echo "Driver postgresql já existe."; \
	fi
	@echo "Iniciando containers do Data Mesh..."
	docker-compose -f $(DATAMESH_COMPOSE) up --build --force-recreate -d
	@echo "Iniciando containers do DataHub..."
	docker-compose -f $(DATAHUB_COMPOSE) up --build --force-recreate -d
	@echo "Restaurando dados do DataHub..."
	cd catalog && chmod +x ./datahub-upgrade.sh && ./datahub-upgrade.sh -u RestoreIndices

# Iniciar os containers sem reconstruí-los
start:
	@echo "Iniciando containers do Data Mesh..."
	docker-compose -f $(DATAMESH_COMPOSE) start
	@echo "Iniciando containers do DataHub..."
	docker-compose -f $(DATAHUB_COMPOSE) start

# Parar os containers sem removê-los
stop:
	@echo "Parando containers do Data Mesh..."
	docker-compose -f $(DATAMESH_COMPOSE) stop
	@echo "Parando containers do DataHub..."
	docker-compose -f $(DATAHUB_COMPOSE) stop

# Forçar a remoção de tudo (imagens, containers, volumes)
clean:
	@echo "Removendo container do DataHub Upgrade..."
	docker rm -f $(CONTAINER_NAME) || true
	@echo "Removendo containers, imagens e volumes do DataHub..."
	docker-compose -f $(DATAHUB_COMPOSE) down -v --rmi all
	@echo "Removendo containers, imagens e volumes do Data Mesh..."
	docker-compose -f $(DATAMESH_COMPOSE) down -v --rmi all