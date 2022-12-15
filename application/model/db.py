def connection():
    import mysql.connector as connector
    db = connector.connect(
        pool_name="mypool",
        pool_size=5,
        host="127.0.0.1",
        user="root",
        password="Password",
        database="TP"
    )
    return db
