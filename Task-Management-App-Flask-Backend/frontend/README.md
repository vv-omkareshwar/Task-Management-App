# Task Management App Frontend

## Overview

This is the frontend part of the Task Management App, a comprehensive solution for managing tasks using a Kanban board interface. Built with React and Next.js, this application provides a responsive and intuitive user interface for task creation, management, and organization.

## Technologies Used

- React 18
- Next.js 13
- TypeScript
- Redux (with Redux Toolkit for state management)
- Tailwind CSS (for styling)
- react-beautiful-dnd (for drag-and-drop functionality)
- Lucide React (for icons)

## Project Structure

```
frontend/
├── app/                 # Next.js 13 app directory
│   ├── (auth)/          # Authentication-related pages
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout component
│   └── page.tsx         # Home page component
├── components/          # Reusable React components
├── public/              # Static assets
├── store/               # Redux store configuration
├── styles/              # Additional style modules
├── types/               # TypeScript type definitions
└── package.json         # Project dependencies and scripts
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd Task-Management-App-Flask-Backend/frontend
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the frontend root directory and add necessary environment variables (e.g., API URL).

4. Run the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Available Scripts

- `npm run dev` or `yarn dev`: Starts the development server.
- `npm run build` or `yarn build`: Builds the application for production.
- `npm start` or `yarn start`: Runs the built application in production mode.
- `npm run lint` or `yarn lint`: Runs the linter to check for code quality issues.

## API Integration

This frontend application interacts with a Flask backend API. Key points about the integration:

- API calls are made to endpoints defined in the backend.
- Authentication is handled using JWT tokens, which are stored in the browser's localStorage.
- The application uses Redux for state management, including storing and managing API response data.

## Deployment

To deploy the frontend application:

1. Build the project:
   ```
   npm run build
   # or
   yarn build
   ```

2. The application can be deployed to platforms like Vercel or Netlify, which offer seamless integration with Next.js projects. Follow the platform-specific instructions for deployment.

3. Ensure that environment variables are properly set in your deployment environment, especially the backend API URL.

## Contributing

Please read the CONTRIBUTING.md file for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the [MIT License](LICENSE).