# Task Management App

A comprehensive task management application with a Flask backend and Next.js frontend. This app allows users to create, organize, and track tasks efficiently.

## Features

- User authentication and authorization
- Create, read, update, and delete tasks
- Organize tasks with status categories (To Do, In Progress, Review, Done)
- Set task priorities and deadlines
- Drag-and-drop interface for easy task management
- Responsive design for desktop and mobile use

## Technologies Used

- Backend: Flask (Python)
- Frontend: Next.js (TypeScript)
- Database: MongoDB
- Authentication: JWT
- API Documentation: Swagger
- State Management: Redux (frontend)
- UI Components: Tailwind CSS

## Project Structure

```
project-root/
├── backend/
│   ├── app.py
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   └── utils/
└── frontend/
    ├── app/
    ├── components/
    ├── store/
    ├── styles/
    └── types/
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd Task-Management-App-Flask-Backend/backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS and Linux:
     ```
     source venv/bin/activate
     ```

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Set up environment variables:
   Create a `.env` file in the backend directory and add the following:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET_KEY=your_jwt_secret_key
   ```

6. Run the Flask application:
   ```
   python app.py
   ```

   The backend server should now be running on `http://localhost:5000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd Task-Management-App-Flask-Backend/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

   The frontend application should now be accessible at `http://localhost:3000`.

## Running Tests

### Backend Tests

To run the backend tests, navigate to the backend directory and run:

```
python -m pytest
```

### Frontend Tests

To run the frontend tests, navigate to the frontend directory and run:

```
npm test
```

## API Documentation

The API documentation is available via Swagger UI. Once the backend server is running, you can access the Swagger documentation at:

```
http://localhost:5000/apidocs
```

This provides a comprehensive overview of all available API endpoints, request/response formats, and allows for interactive testing of the API.

## Contributing

We welcome contributions to the Task Management App! Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

Please ensure your code adheres to the project's coding standards and includes appropriate tests.

## Deployment

Deployment instructions are not covered in this basic README. For production deployment, please refer to the official documentation for Flask and Next.js, and ensure all sensitive information is properly secured.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.