import trino
conn = trino.dbapi.connect(
    host='trino-coordinator',
    port=8080,
    user='trino',
    catalog='trino',
    schema='the-schema',
)
cur = conn.cursor()
cur.execute('SELECT * FROM system.runtime.nodes')