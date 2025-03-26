# Task Management App

## Overview
The Task Management App is a full-stack application designed to help users organize and track their tasks efficiently. It features a Python Flask backend with MongoDB for data storage, and a modern Next.js frontend built with TypeScript and React.

## Technologies Used

### Backend
- Python 3.x
- Flask
- MongoDB
- JWT for authentication
- Swagger for API documentation

### Frontend
- TypeScript
- Next.js
- React
- Redux for state management
- Tailwind CSS for styling

## Project Structure

```
Task-Management-App
├── README.md
├── backend
│   ├── app.py
│   ├── config
│   ├── controllers
│   ├── models
│   ├── requirements.txt
│   ├── routes
│   ├── tests
│   └── utils
└── frontend
    ├── app
    ├── components
    ├── public
    ├── store
    ├── styles
    ├── types
    └── various config files (next.config.mjs, package.json, etc.)
```

## Setup Instructions

### Prerequisites
- Python 3.x
- Node.js (LTS version)
- MongoDB

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd Task-Management-App/backend
   ```
2. Create a virtual environment:
   ```
   python -m venv venv
   ```
3. Activate the virtual environment:
   - On Windows: `venv\Scripts\activate`
   - On macOS and Linux: `source venv/bin/activate`
4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
5. Set up environment variables (create a `.env` file in the backend directory):
   ```
   FLASK_APP=app.py
   FLASK_ENV=development
   SECRET_KEY=your_secret_key
   MONGO_URI=your_mongodb_connection_string
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd Task-Management-App/frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
   or if you're using Yarn:
   ```
   yarn install
   ```

## Running the Application

### Backend
1. Ensure you're in the backend directory with the virtual environment activated.
2. Run the Flask application:
   ```
   flask run
   ```
   The backend server will start, typically on `http://localhost:5000`.

### Frontend
1. In the frontend directory, start the Next.js development server:
   ```
   npm run dev
   ```
   or with Yarn:
   ```
   yarn dev
   ```
   The frontend will be available at `http://localhost:3000`.

## API Documentation
The API is documented using Swagger. Once the backend is running, you can access the Swagger UI at:
```
http://localhost:5000/swagger/
```

## Testing

### Backend Tests
To run backend tests:
1. Navigate to the backend directory.
2. Run:
   ```
   python -m pytest
   ```

### Frontend Tests
To run frontend tests:
1. Navigate to the frontend directory.
2. Run:
   ```
   npm test
   ```
   or with Yarn:
   ```
   yarn test