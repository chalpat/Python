# SQL Runner Backend

This is the backend component of the SQL Runner application, which allows users to execute SQL queries against an SQLite database.

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd sql-runner-app/backend
   ```

2. **Create a virtual environment (optional but recommended):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install the required dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application:**
   ```bash
   python app.py
   ```

The server will start on `http://localhost:5000` by default.

## Usage

- The backend exposes an API endpoint to execute SQL queries. You can send a POST request to `/query` with the SQL query in the request body.
- The application connects to the SQLite database located at `database/database.db`.

## Database

The SQLite database file is located in the `database` directory. You can manage the database using any SQLite client or through the provided API.

## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements for the backend.