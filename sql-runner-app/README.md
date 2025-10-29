# SQL Runner Application

This project is a full-stack web application that allows users to execute SQL queries against an SQLite database. It consists of a frontend built with Next.js and a backend powered by Flask.

## Project Structure

```
sql-runner-app
├── backend
│   ├── app.py                # Main entry point for the backend application
│   ├── database
│   │   └── database.db       # SQLite database file
│   ├── requirements.txt       # Python dependencies for the backend
│   └── README.md              # Documentation for the backend
├── frontend
│   ├── public                 # Static assets for the frontend
│   ├── src
│   │   ├── components
│   │   │   └── QueryRunner.tsx # React component for executing SQL queries
│   │   ├── pages
│   │   │   ├── api
│   │   │   │   └── query.ts   # API route for executing SQL queries
│   │   │   └── index.tsx      # Main page of the Next.js application
│   │   └── styles
│   │       └── globals.css     # Global CSS styles
│   ├── package.json            # npm configuration for the frontend
│   ├── next.config.js          # Configuration settings for Next.js
│   └── README.md               # Documentation for the frontend
└── README.md                   # Overall documentation for the project
```

## Getting Started

### Prerequisites

- Python 3.x
- Node.js and npm

### Backend Setup

1. Navigate to the `backend` directory:
   ```
   cd backend
   ```

2. Install the required Python packages:
   ```
   pip install -r requirements.txt
   ```

3. Run the Flask application:
   ```
   python app.py
   ```

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```
   cd frontend
   ```

2. Install the required npm packages:
   ```
   npm install
   ```

3. Start the Next.js application:
   ```
   npm run dev
   ```

### Usage

- Open your browser and navigate to `http://localhost:3000` to access the SQL Runner interface.
- Input your SQL queries and view the results directly in the application.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.