CREATE SCHEMA  IF NOT EXISTS minio.dadosdeclientes
    WITH (location = 's3a://dadosdeclientes/');

CREATE TABLE IF NOT EXISTS minio.dadosdeclientes.dadosclientes (
    _id ROW(
        yearBday INT,
        gender VARCHAR
    ),
        count INT
    )
    WITH (
       format = 'json',
       external_location = 's3a://dadosdeclientes/json/'
    );