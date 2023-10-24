 <img src="https://upload.wikimedia.org/wikipedia/commons/e/ee/Ufabc_logo.png" width="75"/> <br /> <br /> 
## Universidade Federal do ABC <br />
## Projeto de Graduação em Computação (PGC) - Orientador: Prof. Dr. Carlos Alberto Kamienski - agosto de 2023 <br /><br />

## NOVAS ARQUITETURAS DE DADOS E SUAS PERSPECTIVAS <br /><br />

## Solarié <br /><br /><br />

<img src="https://github.com/lima-renan/solarie/blob/main/arquitetura/datamesh-solarie-solucao.png" width="1500"/> <br /> <br /> 

## Renan Ferreira Lima <br />   GitHub: lima-renan <br />  Linkedin: linkedin.com/in/renanflimabr


### Repositório com os códigos-fonte da aplicação desenvolvida para complementar o que foi estudado na monografia. O tema central do Projeto são as Novas Arquiteturas de dados, em especial, o Data Mesh  <br /><br /><br />
### A aplicação foi denominada de Solarié, sendo o frontend baseado no Eyesome cujo template foi desenvolvido pela usuária do Github Sandhya1007, vide: https://github.com/SandhyaR1007/eyesome-react <br /><br />
### Para o backend, utilizou-se um template  mern-auth-server disponibilizado pelo usuário do Github collegewap, vide: https://github.com/collegewap/mern-auth-server
### Para comentários de código, configurações de jdbc e blocos de códigos mais operacionais utilizou-se o ChatGPT como apoio, vide: https://chat.openai.com/ 
### O diretório arquitetura/ traz os desenhos desenvolvidos e a detalhes das tecnologias utilizadas. <br /><br />
### Para executar o projeto deve-se ter o docker e o docker compose instalados, vide: https://docs.docker.com/get-docker/ <br /><br />
### A execução do projeto é feita a partir dos comandos: 1 - Criar um .env no diretório raiz do projeto e copiar os dados de env.txt, 2 - docker-compose -f docker-compose.DataMesh.yml up --build --force-recreate, 3 - docker-compose -f catalog/docker-compose.DataHub.yml up --build --force-recreate (Obs: Caso o container não inicialize corretamente por unhealthy, reinicialize o container e execute: docker-compose -f catalog/docker-compose.DataHub.yml up, em último caso, execute docker-compose -f catalog/docker-compose.DataHub.yml down -v e repita o comando docker-compose -f catalog/docker-compose.DataHub.yml up --build --force-recreate), 4 - Em alguns casos, poe ser que o erro seja por problema de permissionamento nos volumes, neste caso execute: sudo chmod 777 -R volumes/ (no Ubuntu),  5 - Caso use o linux execute chmod +x ./catalog/datahub-upgrade.sh e, em seguida, ./catalog/datahub-upgrade.sh -u RestoreIndices, em seguida, execute: docker-compose -f catalog/docker-compose.DataHub.yml stop e docker-compose -f catalog/docker-compose.DataHub.yml start  <br /><br />
### A exclusão dos containers é feita através: 1 - docker-compose -f catalog/docker-compose.DataMesh.yml down -v, 2 - docker-compose -f docker-compose.DataMesh.yml down -v <br /><br />
### No diretório volumes/ há alguns scripts adicionais para testes e execução do projeto.  <br /><br />
### No diretório catalog/ há alguns scripts e códigos relacionados ao catálogo de dados.  <br /><br />
### Já os diretório frontend/ e backend/ há códigos relacionados a estas estruturas. <br /><br />
### O diretório relatorio/ tema a monografia em pdf. <br /><br />
### O endpoint do Solarié é o http://localhost:3000, os demais endpoints estão especificados em docker-compose.DataMesh.yml
