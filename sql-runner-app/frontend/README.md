# SQL Runner Application - Frontend

This is the frontend part of the SQL Runner application built using Next.js. It allows users to execute SQL queries against a SQLite database and view the results in a user-friendly interface.

## Getting Started

To get started with the frontend application, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd sql-runner-app/frontend
   ```

2. **Install dependencies**:
   Make sure you have Node.js installed. Then run:
   ```bash
   npm install
   ```

3. **Run the application**:
   Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## Folder Structure

- `public/`: Contains static assets such as images and icons.
- `src/`: Contains the source code for the application.
  - `components/`: Contains React components, including the `QueryRunner` component.
  - `pages/`: Contains the pages of the application, including the API route for executing SQL queries.
  - `styles/`: Contains global CSS styles for the application.

## Features

- Input SQL queries through a user-friendly interface.
- Execute queries against a SQLite database.
- View results directly in the application.

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.