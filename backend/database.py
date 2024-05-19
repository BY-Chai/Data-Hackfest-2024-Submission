import sqlite3

def get_db_connection():
    conn = sqlite3.connect('users.db')
    return conn

def initialize_db():
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                name TEXT NOT NULL,
                pw TEXT NOT NULL 
                city TEXT, 
                state TEXT,
                country TEXT,
                routes TEXT
            );
        """)
        conn.commit()

