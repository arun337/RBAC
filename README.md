# Library Management System

## Overview
This is a Library Management System built with React, allowing users to register, log in, manage their profiles, and check out books. Admins can manage users, roles, and books through an admin dashboard.

username:admin
password:admin@123 || username:user@example,password:user@123

## Features
- User registration and login
- Profile management (update user details and profile photo)
- Book checkout and return functionality
- Admin dashboard for managing users, roles, and books
- Responsive design for various screen sizes

## Technologies Used
- **Frontend**: React, React Router, React Icons
- **Backend**: JSON Server (for mock API)
- **Styling**: Tailwind CSS (or custom CSS)
- **State Management**: React Hooks (useState, useEffect)

## Getting Started

### Prerequisites
- Node.js and npm installed on your machine.
- JSON Server for simulating a backend API.

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the JSON Server:
   ```bash
   json-server --watch db.json --port 3001
   ```

4. Start the React application:
   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3001`.




## API Endpoints
- **Users**
  - `GET /users`: Retrieve all users
  - `POST /users`: Create a new user
  - `PUT /users/:id`: Update user details
  - `DELETE /users/:id`: Delete a user

- **Books**
  - `GET /books`: Retrieve all books
  - `POST /books`: Create a new book
  - `PUT /books/:id`: Update book details
  - `DELETE /books/:id`: Delete a book

- **Roles**
  - `GET /roles`: Retrieve all roles
  - `POST /roles`: Create a new role
  - `PUT /roles/:id`: Update role details
  - `DELETE /roles/:id`: Delete a role
