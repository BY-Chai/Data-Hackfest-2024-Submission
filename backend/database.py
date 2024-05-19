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


def setup_add_user(name: str, pw: str, city: str, state: str, country: str):
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(f"""INSERT INTO users VALUES
              ('{name}', '{pw}', '{city}', '{state}', '{country}', 'NONE')""")
        conn.commit()

if __name__ == "__main__":
    conn = get_db_connection()
    initialize_db()
    c = conn.cursor()

    setup_add_user('user1', '1234a', 'Toronto', 'Ontario', 'CAN')
    setup_add_user('user2', '5678b', 'Vancouver', 'British Columbia', 'CAN')
    c.execute("SELECT * FROM users")
    print(c.fetchall())