# Proje-1 - Online Shopping Site

## Project Overview
This is a full-stack e-commerce application with separate frontend, admin panel, and backend services. The application allows users to browse products, add them to cart, and place orders, while administrators can manage products, orders, and users.

## Project Structure
- **Frontend**: Customer-facing web application
- **Admin**: Administration panel for managing the store
- **Backend**: RESTful API service with MongoDB database

## Technologies Used

### Frontend
- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Axios for API requests
- Ant Design components
- Framer Motion for animations
- React Toastify for notifications
- Swiper for carousels

### Admin Panel
- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Axios for API requests
- Recharts for data visualization
- React Toastify for notifications

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Cloudinary for image storage
- Multer for file uploads
- Stripe and Razorpay for payment processing
- CORS for cross-origin requests

## Installation and Setup

### Frontend and Admin Setup
```bash
# Navigate to frontend or admin directory
cd frontend
# or
cd admin

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to Backend directory
cd Backend

# Install dependencies
npm install

# Start development server
npm run server
```

## API Endpoints

The backend provides the following API endpoints:
- `/api/user` - User authentication and management
- `/api/product` - Product management
- `/api/cart` - Shopping cart operations
- `/api/order` - Order processing and management

## Features
- User authentication and authorization
- Product browsing and filtering
- Shopping cart functionality
- Order placement and tracking
- Admin dashboard for store management
- Payment processing integration
- Responsive design for mobile and desktop

## Environment Variables
Create a `.env` file in the Backend directory with the following variables:
- `PORT` - Server port (default: 4000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT token generation
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- Payment gateway credentials (Stripe/Razorpay) 