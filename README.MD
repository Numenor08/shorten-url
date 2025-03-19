
# Shorten Link API

Shorten Link API is a Node.js-based application that allows users to shorten URLs and manage user authentication using Google OAuth and local authentication.

## Table of Contents

- [Features](#Features)
- [Technologies Used](#Technologies-Used)
- [Installation and Usage](#Installation-and-Usage)
- [API Routes](#API-Routes)
  - [Authentication](#Authentication)
  - [URL Shortener](#URL-Shortener)

---

## Features

- **Authentication**: Supports Google OAuth and local authentication.
- **URL Shortener**: Create shortened URLs with customization options.
- **Rate Limiting**: Limits the number of requests to prevent abuse.
- **Session Management**: Uses PostgreSQL to store user sessions.

---

## Technologies Used

The following technologies and libraries are used in this project:

- **Node.js**: v18+
- **Express**: v4.21.2
- **TypeScript**: v5.8.2
- **Sequelize**: v6.37.6
- **PostgreSQL**: Database for storing URL and user data.
- **Passport**: v0.7.0 (for authentication)
  - **passport-google-oauth20**: v2.0.0
  - **passport-local**: v1.0.0
- **express-session**: v1.18.1 (for session management)
- **connect-pg-simple**: v10.0.0 (to store sessions in PostgreSQL)
- **express-validator**: v7.2.1 (for input validation)
- **express-rate-limit**: v7.5.0 (for request limiting)
- **nanoid**: v5.1.3 (to generate short URLs)
- **bcryptjs**: v3.0.2 (for password hashing)
- **dotenv**: v16.4.7 (to manage environment variables)

---

## Installation and Usage

### 1. Clone Repository

```bash
git clone https://github.com/username/shorten-link.git
cd shorten-link
```

### 2. Install Dependencies

Use `npm` to install dependencies:

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file based on `.env.example`:

```bash
PORT=3000
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_DATABASE=your_db_name
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
```

### 4. Run the Server

For development mode:

```bash
npm run build
npm run dev
```

For production mode:

```bash
npm run build
npm run start
```

## 
API Routes

---

### Authentication

#### 1. Google OAuth

* **GET** `/api/auth/google`
  Redirects users to the Google login page.
* **GET** `/api/auth/google/callback`
  Callback URL after successful Google login.

  **Note**: If the user's email is already registered manually (without a Google ID), the system will update the account with the new Google ID. This allows users to log in using Google OAuth without creating duplicate accounts.

#### 2. Register

* **POST** `/api/auth/register`
  Registers a new user.
  **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "Password123"
  }
  ```

#### 3. Login

* **POST** `/api/auth/login`
  Logs in using email and password.
  **Body:**
  ```json
  {
    "email": "johndoe@example.com",
    "password": "Password123"
  }
  ```

#### 4. Get Session

* **GET** `/api/auth/session`
  Retrieves session data.

#### 5. Logout

* **GET** `/api/auth/logout`
  Logs out from the current session.

---

### URL Shortener

#### 1. Create Short URL

* **POST** `/api/shorten`
  Creates a shortened URL.

  **Headers:**

  - `Authorization`: Bearer token (required for authentication)

  **Body:**

  ```json
  {
    "originalUrl": "https://example.com",
    "customUrl": "mycustomurl" // Optional
  }
  ```

  **Response:**

  ```json
  {
    "status": "success",
    "data": {
      "id": 1,
      "originalUrl": "https://example.com",
      "shortUrl": "http://localhost:3000/mycustomurl",
      "createdAt": "2025-03-19T12:00:00.000Z"
    }
  }
  ```

#### 2. Get All Short URLs

* **GET** `/api/shorten`
  Retrieves all shortened URLs owned by the currently logged-in user.

  **Headers:**

  - `Authorization`: Bearer token (required for authentication)

  **Response:**

  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 1,
        "originalUrl": "https://example.com",
        "shortUrl": "http://localhost:3000/mycustomurl",
        "createdAt": "2025-03-19T12:00:00.000Z"
      },
      {
        "id": 2,
        "originalUrl": "https://anotherexample.com",
        "shortUrl": "http://localhost:3000/anotherurl",
        "createdAt": "2025-03-19T12:05:00.000Z"
      }
    ]
  }
  ```

#### 3. Get Short URL by ID

* **GET** `/api/shorten/:id`
  Retrieves details of a shortened URL by ID.

  **Headers:**

  - `Authorization`: Bearer token (required for authentication)

  **Response:**

  ```json
  {
    "status": "success",
    "data": {
      "id": 1,
      "originalUrl": "https://example.com",
      "shortUrl": "http://localhost:3000/mycustomurl",
      "createdAt": "2025-03-19T12:00:00.000Z"
    }
  }
  ```

#### 4. Delete Short URL

* **DELETE** `/api/shorten/:id`
  Deletes a shortened URL by ID.

  **Headers:**

  - `Authorization`: Bearer token (required for authentication)

  **Response:**

  ```json
  {
    "status": "success",
    "message": "Short URL deleted successfully."
  }
  ```

---

## Project Structure

```
shorten-link/
├── src/
│   ├── config/         # Configuration for database and passport
│   ├── controllers/    # Business logic for authentication and URL
│   ├── middlewares/    # Middleware for validation and authentication
│   ├── models/         # Sequelize models for the database
│   ├── routes/         # API route definitions
│   ├── types/          # TypeScript type declarations
│   └── server.ts       # Application entry point
├── db/                 # SQL files for the database
├── [.env.example](http://_vscodecontentref_/1)        # Example environment file
├── [package.json](http://_vscodecontentref_/2)        # npm configuration
├── [tsconfig.json](http://_vscodecontentref_/3)       # TypeScript configuration
└── [README.md](http://_vscodecontentref_/4)           # Project documentation
```

---

## Notes:

* Ensure PostgreSQL is installed and running on your system.
* Use tools like Postman to test the API endpoints.
* Remember to keep your `.env` file secure.

---

## Contributors

* **Athaya Razan Zaidan**
  Author and main developer of this project.
