
# Task Management App

Welcome to the Task Management App! This project is a full-stack application designed to help you manage your tasks efficiently. It uses modern technologies such as NextJS with TypeScript for the frontend, Node.js with Express for the backend, and MongoDB for the database. The application is currently deployed and can be accessed [here](https://task-manamement-app.netlify.app/).

## Technical Requirements

- **Frontend:** NextJS with TypeScript
- **Backend:** Node.js with Express
- **Database:** MongoDB
- **State Management:** Redux 
- **Styling:** TailwindCSS

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js
- Yarn (If not installed, use `npm install -g yarn`)
- MongoDB (Set up your MongoDB instance)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/omkareshwar9849/task-management-app.git
   cd task-management-app
   ```

2. **Backend Setup:**
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     yarn install
     ```
   - Update the `.env` file in the `backend` directory and add your MongoDB URL:
     ```env
     MONGO="Enter your mongoDB URL"
     ```
   - Start the backend server:
     ```bash
     yarn start
     ```

3. **Frontend Setup:**
   - Open a new terminal and navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     yarn install
     ```
   - Update  the `.env` file in the `frontend` directory if you want to change the backend URL or PORT:
     ```env
     NEXT_PUBLIC_BACKEND_URL="http://localhost:5000"
     ```
   - Start the frontend development server:
     ```bash
     yarn dev
     ```

### Running the Application

After setting up both the backend and frontend, you can access the application in your browser at `http://localhost:3000`.

## Deployment

The application is deployed at [Task Management App](https://task-manamement-app.netlify.app/). Follow the instructions provided by your deployment platform to deploy your application version.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Happy coding! If you have any questions or need further assistance, feel free to open an issue on the GitHub repository.
