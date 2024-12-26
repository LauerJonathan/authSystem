# Auth API - Backend

Backend API service for handling user authentication. This API is built using Express.js, MongoDB, and JWT (JSON Web Tokens).

## Development Environment

To run this API locally, you'll need:

- Node.js
- MongoDB
- npm or yarn

## Installation

1. Clone the repository

git clone https://github.com/LauerJonathan/authSystem
cd authSystem

2. Install dependencies

npm install
# or
yarn install

3. Configure your environment variables in a `.env` file

PORT=3000
MONGODB_URI=mongodb://localhost:27017/auth-api
JWT_SECRET=your-secret-key

- `MONGODB_URI`: The MongoDB URI for connecting to your database (can be a local or cloud MongoDB instance like MongoDB Atlas).
- `JWT_SECRET`: A secret key for signing JWT tokens. Keep it secure!

## Getting Started

To start the API in development mode:

npm run dev
# or
yarn dev

The API will be available at `http://localhost:3000`.

## Production URL

Planned production URL: `http://www.example.com/api/auth`

## API Documentation

### 1. **Register** (`POST /api/register`)

Registers a new user.

#### Request Body:
{
  "email": "user@example.com",
  "password": "yourpassword"
}

#### Response:
{
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "createdAt": "2023-12-26T00:00:00.000Z"
  },
  "token": "jwt_token"
}

### 2. **Login** (`POST /api/login`)

Logs in an existing user.

#### Request Body:
{
  "email": "user@example.com",
  "password": "yourpassword"
}

#### Response:
{
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "createdAt": "2023-12-26T00:00:00.000Z"
  },
  "token": "jwt_token"
}

### 3. **Profile** (`GET /api/profile`)

Fetches the profile of the authenticated user. This route requires a valid JWT token.

#### Request Header:
- `Authorization: Bearer <jwt_token>`

#### Response:
{
  "_id": "user_id",
  "email": "user@example.com",
  "createdAt": "2023-12-26T00:00:00.000Z"
}

## Authentication Middleware

This API uses JWT tokens to authenticate users. After registration or login, a token is returned. The token must be included in the `Authorization` header to access protected routes (like `/api/profile`).

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Author

- Your Name
- GitHub: [@LauerJonathan](https://github.com/LauerJonathan)