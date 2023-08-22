 <img src="https://upload.wikimedia.org/wikipedia/commons/e/ee/Ufabc_logo.png" width="75"/> <br /> <br /> Universidade Federal do ABC <br />
## Projeto de Graduação em Computação (PGC) - Orientador: Prof. Dr. Carlos Alberto Kamienski - agosto de 2023 <br /><br />

## NOVAS ARQUITETURAS DE DADOS E SUAS PERSPECTIVAS <br /><br />

### Solarié <br /><br /><br />


## Renan Ferreira Lima <br />   ## GitHub: lima-renan <br /> 	## Linkedin: linkedin.com/in/renanflimabr


## Repositório com os códigos-fonte da aplicação desenvolvida para complementar o que foi estudado na monografia. O tema central do Projeto são as Novas Arquiteturas de dados, em especial, o Data Mesh  <br /><br /><br />
### A aplicação foi denomindada de Solarié, sendo o frontend baseado no Eyesome cujo template foi desenvolvido pela usuária do Github Sandhya1007, vide: https://github.com/SandhyaR1007/eyesome-react <br /><br />
### Para o backend, utilizou-se um template  mern-auth-server disponibilizado pelo usuário do Github collegewap, vide: https://github.com/collegewap/mern-auth-server
### Para comentários de código, configurações de jdbc e blocos de códigos mais operacionais utilizou-se o ChatGPT como apoio, vide: https://chat.openai.com/ 
### O diretório arquitetura/ traz os desenhos desenvolvidos e a detalhes das tecnologias utilizadas. <br /><br />
### Para executar o projeto deve-se ter o docker e o docker compose instalados, vide: https://docs.docker.com/get-docker/ <br /><br />
### A execução do projeto é feita a partir dos comandos: 1 - Criar um .env no diretório raiz do projeto e copiar os dados de env.txt, 2 - docker-compose -f docker-compose.DataMesh.yml up --build --force-recreate, 3 - docker-compose -f catalog/docker-compose.DataMesh.yml up --build --force-recreate, 4 - ./catalog/datahub-upgrade.sh -u RestoreIndices <br /><br />
### A exclusão dos containers é feita através: 1 - docker-compose -f catalog/docker-compose.DataMesh.yml down -v, 2 - docker-compose -f docker-compose.DataMesh.yml down -v <br /><br />
### No diretório volumes/ há alguns scripts adicionais para testes e execução do projeto.  <br /><br />
### No diretório catalog/ há alguns scripts e códigos relacionados ao catálogo de dados.  <br /><br />
### Já os diretório frontend/ e backend/ há códigos relacionados a estas estruturas. <br /><br />
### O endpoint do Solarié é o http://localhost:3000, os demias endpoinst estão especificados em docker-compose.DataMesh.yml
