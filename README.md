# Zyberra Backend

Zyberra is a digital gadget eCommerce platform. This is the backend built using Node.js, Express, and MongoDB. It provides APIs and admin functionality for managing users, products, categories, orders, and secure authentication.

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- ImageKit for image hosting
- express-fileuploader for handling file uploads
- dotenv for environment configuration

## Prerequisites

Before running the backend, make sure you have:

- **Node.js** (v14 or later)
- **MongoDB** (either local or Atlas)
- **npm**

## Installation

### 1. Clone the Repository

```bash
git clone <your-backend-repo-url>
cd zyberra-backend
2. Install Dependencies

npm install
3. Set Up Environment Variables
Create a .env file in the root directory and add the following variables:

env
PORT=4000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
IMAGEKIT_PUBLIC_KEY=<your-imagekit-public-key>
IMAGEKIT_PRIVATE_KEY=<your-imagekit-private-key>
IMAGEKIT_URL_ENDPOINT=<your-imagekit-url-endpoint>
💡 Replace the placeholder values with your actual credentials.

4. Start the Server

npm run dev
The backend server will start on: http://localhost:4000.

Scripts
npm run dev – start server in development with nodemon

npm start – run server in production mode

Core Features
🔐 User authentication (register, login, logout, forgot password with email link)

📁 Product & category management (CRUD)

🛍️ Wishlist and cart functionality (user-protected)

📦 Order handling

🧑‍💼 Admin-only protected routes

📸 Image upload using ImageKit via express-fileuploader

🌐 Fully RESTful API endpoints

Middleware
protect: Ensures routes are accessed by logged-in users only.

adminProtect: Ensures access to admin routes only for admins.