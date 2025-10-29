from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS
import os

app = Flask(__name__)
# Enable CORS so that direct browser calls to the backend (if any) succeed.
# The project already lists `Flask-Cors` in `requirements.txt`.
CORS(app)

# Use absolute path to avoid working directory issues
DATABASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'database', 'database.db')

def init_db():
    """Initialize the database with a test table if it doesn't exist."""
    db_path = os.path.dirname(DATABASE)
    if not os.path.exists(db_path):
        os.makedirs(db_path)
    
    # Create a fresh database connection without using get_db_connection
    # to avoid potential issues with sqlite3.Row factory during initialization
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Create the test table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE
            )
        ''')
        
        # Check if the table is empty
        cursor.execute("SELECT COUNT(*) FROM users")
        count = cursor.fetchone()[0]
        
        if count == 0:
            # Insert sample data only if the table is empty
            cursor.execute('''
                INSERT INTO users (name, email) VALUES
                ('John Doe', 'john@example.com'),
                ('Jane Smith', 'jane@example.com')
            ''')
        
        conn.commit()
        print(f"Database initialized successfully at {DATABASE}")
        
    except sqlite3.Error as e:
        print(f"Database initialization error: {e}")
        # If database file is corrupted, try to remove it and create fresh
        if "file is not a database" in str(e):
            try:
                conn.close()
                os.remove(DATABASE)
                print(f"Removed corrupted database file. Retrying initialization...")
                # Recursive call to try one more time with a fresh file
                return init_db()
            except Exception as cleanup_err:
                print(f"Error during cleanup: {cleanup_err}")
                raise
        raise
    finally:
        if 'conn' in locals():
            conn.close()

def get_db_connection():
    """Get a database connection with dictionary row factory."""
    try:
        conn = sqlite3.connect(DATABASE)
        conn.row_factory = sqlite3.Row
        # Quick test query to verify database integrity
        conn.cursor().execute("SELECT 1")
        return conn
    except sqlite3.Error as e:
        print(f"Database connection error: {e}")
        if "file is not a database" in str(e):
            # Try to reinitialize the database
            print("Attempting database reinitialization...")
            init_db()
            # Try one more time
            conn = sqlite3.connect(DATABASE)
            conn.row_factory = sqlite3.Row
            return conn
        raise

@app.route('/execute', methods=['POST'])
def execute_query():
    query = request.json.get('query')
    if not query:
        return jsonify({'error': 'No query provided'}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(query)
        if query.strip().lower().startswith('select'):
            results = cursor.fetchall()
            return jsonify([dict(row) for row in results]), 200
        else:
            conn.commit()
            return jsonify({'message': 'Query executed successfully'}), 200
    except sqlite3.Error as e:
        return jsonify({'error': str(e)}), 400
    finally:
        conn.close()


@app.route('/tables', methods=['GET'])
def list_tables():
    try:
        conn = get_db_connection()
        print("Conenction Status----------", conn)
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';")
        rows = cursor.fetchall()
        tables = [row['name'] for row in rows]
        return jsonify({'tables': tables}), 200
    except sqlite3.Error as e:
        return jsonify({'error': str(e)}), 400
    finally:
        conn.close()


@app.route('/table/<table_name>', methods=['GET'])
def table_info(table_name):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Verify table exists to avoid SQL injection via identifier interpolation
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?;", (table_name,))
        found = cursor.fetchone()
        if not found:
            return jsonify({'error': f"Table '{table_name}' not found"}), 404

        # Get schema using PRAGMA
        cursor.execute(f"PRAGMA table_info('{table_name}')")
        cols = cursor.fetchall()
        schema = [{'name': col['name'], 'type': col['type']} for col in cols]

        # Get sample rows (first 5)
        cursor.execute(f"SELECT * FROM '{table_name}' LIMIT 5")
        sample_rows = cursor.fetchall()
        samples = [dict(row) for row in sample_rows]

        return jsonify({'schema': schema, 'samples': samples}), 200
    except sqlite3.Error as e:
        return jsonify({'error': str(e)}), 400
    finally:
        conn.close()

if __name__ == '__main__':
    # Ensure database directory exists
    os.makedirs(os.path.dirname(DATABASE), exist_ok=True)
    # Initialize database with test data if needed
    init_db()
    app.run(debug=True)