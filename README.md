# Shoe Store - E-commerce Application

A full-stack e-commerce application for selling shoes, built with React frontend and FastAPI backend.

## Features

### Customer Features
- Browse product catalog with filtering
- View detailed product information
- User registration and authentication
- Shopping cart management
- Product variants (sizes and colors)
- Order placement

### Admin Features
- Product management (add, delete)
- Variant management (sizes, colors, stock)
- Inventory tracking
- User role management

## Tech Stack

### Frontend
- React 18
- React Router for navigation
- Axios for API communication
- Context API for state management
- CSS3 for styling

### Backend
- FastAPI (Python)
- SQLAlchemy ORM
- SQLite database
- JWT authentication
- Bcrypt password hashing

## Installation

### Prerequisites
- Node.js (v18 or higher)
- Python 3.8+
- pip

### Backend Setup
```bash
cd shoe-store-api
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs on `http://localhost:8000`

### Frontend Setup
```bash
cd shoe-store-frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation.

## Database Schema

### Users
- Authentication with JWT tokens
- Role-based access control (admin/customer)

### Products
- Product catalog with brands and descriptions
- Base pricing
- Image URLs

### Variants
- Product variants (size, color)
- Individual stock tracking
- Size options in EU format

### Shopping Cart
- User-specific carts
- Quantity management
- Automatic total calculation

## Authentication

The application uses JWT tokens for authentication. Tokens are stored in localStorage and automatically included in API requests.

Admin users have additional privileges for product and inventory management.

## Project Structure
```
shoe-store-frontend/
├── src/
│   ├── components/     # React components
│   ├── context/        # Context providers
│   ├── services/       # API service layer
│   └── App.js
└── public/

shoe-store-api/
├── models/            # SQLAlchemy models
├── routes/            # API endpoints
├── auth/              # Authentication logic
└── main.py
```

## Future Enhancements

- Payment integration (Stripe)
- Product reviews and ratings
- Order history
- Email notifications
- Search functionality
- Image upload for products
- Responsive mobile design

## License

This project is for portfolio purposes.

## Author

Sami - Full-stack Developer
