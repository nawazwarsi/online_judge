# Online Judge System

A full-stack web application that allows users to solve programming problems online. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- User authentication (register, login, logout)
- Browse and search programming problems
- Submit solutions in multiple languages (C++, Python, Java)
- Real-time code execution and feedback
- Track submission history and statistics
- User profile with performance metrics

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Docker (for code execution)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd online-judge
```

2. Install dependencies for all parts of the application:
```bash
npm run install-all
```

3. Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/online-judge
JWT_SECRET=your_jwt_secret
```

4. Create a `.env` file in the frontend directory with the following variables:
```
REACT_APP_API_URL=http://localhost:5001/api
```

## Running the Application

1. Start MongoDB:
```bash
mongod
```

2. Start the application (both frontend and backend):
```bash
npm start
```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:5000`.

## Development

- Frontend: `cd frontend && npm start`
- Backend: `cd backend && npm run dev`

## Building for Production

1. Build the frontend:
```bash
npm run build
```

2. The backend is already configured for production with PM2.

## Project Structure

```
online-judge/
├── frontend/           # React frontend
├── backend/           # Node.js/Express backend
├── docker/           # Docker configuration
└── package.json      # Root package.json
```

## API Documentation

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Problems
- GET /api/problems - Get all problems
- GET /api/problems/:id - Get problem by ID
- POST /api/problems - Create new problem (admin only)
- PUT /api/problems/:id - Update problem (admin only)
- DELETE /api/problems/:id - Delete problem (admin only)

### Submissions
- GET /api/submissions - Get user submissions
- POST /api/submissions - Submit solution
- GET /api/submissions/:id - Get submission by ID

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 