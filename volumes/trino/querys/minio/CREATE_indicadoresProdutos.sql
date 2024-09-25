CREATE SCHEMA IF NOT EXISTS minio.dadosdeprodutos
    WITH (location = 's3a://dadosdeprodutos/');

CREATE TABLE IF NOT EXISTS minio.dadosdeprodutos.indicadoresProdutos (
        indicator VARCHAR,
        group_indicator VARCHAR,
        value_indicator DOUBLE
) WITH (
    format = 'json',
    external_location = 's3a://dadosdeprodutos/json/'
);
