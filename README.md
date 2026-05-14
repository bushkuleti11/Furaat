# Mini Cashier System

A simple Point of Sale (POS) system built with **NestJS** (backend) and **React** (frontend) for educational purposes.

## 🚀 Features

### Core Features
- ✅ View Products
- ✅ Add to Cart
- ✅ Checkout (Calculate total and balance)
- ✅ In-memory data storage (no database)
- ✅ Role-based access control (Cashier, Supervisor, Admin)
- ✅ No authentication (uses request headers for role)

### Role Permissions

| Role | Permissions |
|------|-------------|
| **Cashier** | View Products, Checkout |
| **Supervisor** | View Products, Sales Summary |
| **Admin** | View Products, Add Products, Sales Summary |

## 📁 Project Structure

```
Furaat/
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── main.ts            # Application entry point
│   │   ├── app.module.ts      # Root module
│   │   ├── cashier/
│   │   │   ├── cashier.module.ts       # Cashier module
│   │   │   ├── cashier.controller.ts   # HTTP endpoints
│   │   │   └── cashier.service.ts      # Business logic
│   │   ├── decorators/
│   │   │   └── roles.decorator.ts      # Role decorator
│   │   └── guards/
│   │       └── roles.guard.ts          # Role-based access guard
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/                   # React Frontend
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── index.js
    │   ├── index.css
    │   ├── App.js              # Main component
    │   └── components/
    │       ├── RoleSelector.js      # Role selection
    │       ├── ProductList.js       # Display products
    │       ├── Cart.js              # Shopping cart
    │       ├── SalesSummary.js      # Sales report
    │       └── AdminPanel.js        # Admin controls
    └── package.json
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on: `http://localhost:3001`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on: `http://localhost:3000`

## 📡 API Endpoints

All endpoints require role header: `x-user-role`

### GET /api/products
- **Allowed Roles**: Cashier, Supervisor, Admin
- **Description**: Get all available products
- **Response**:
```json
[
  {
    "id": 1,
    "name": "Laptop",
    "price": 999,
    "quantity": 5
  }
]
```

### POST /api/checkout
- **Allowed Roles**: Cashier
- **Description**: Process a transaction
- **Request Body**:
```json
{
  "items": [
    { "productId": 1, "quantity": 2 }
  ],
  "paid": 2000
}
```
- **Response**:
```json
{
  "success": true,
  "total": 1998,
  "paid": 2000,
  "balance": 2,
  "message": "Payment successful!"
}
```

### GET /api/sales-summary
- **Allowed Roles**: Supervisor, Admin
- **Description**: Get sales statistics and transaction history
- **Response**:
```json
{
  "totalRevenue": 5000.50,
  "totalTransactions": 10,
  "averageTransaction": 500.05,
  "transactions": [...]
}
```

### POST /api/add-product
- **Allowed Roles**: Admin
- **Description**: Add a new product
- **Request Body**:
```json
{
  "name": "Monitor",
  "price": 300,
  "quantity": 10
}
```
- **Response**:
```json
{
  "id": 6,
  "name": "Monitor",
  "price": 300,
  "quantity": 10
}
```

## 🔐 Role-Based Access Control

The system implements RBAC using:

1. **@Roles() Decorator** - Defines which roles can access an endpoint
2. **RolesGuard** - Middleware that checks user role from request header
3. **x-user-role Header** - Specifies the user's role (cashier, supervisor, admin)

### Example Request
```bash
curl -X GET http://localhost:3001/api/products \
  -H "x-user-role: cashier"
```

## 💡 How to Use

### As a Cashier
1. Select "Cashier" role from the top menu
2. Browse products
3. Click "Add to Cart" to add items
4. Adjust quantities as needed
5. Enter payment amount
6. Click "Checkout" to complete transaction

### As a Supervisor
1. Select "Supervisor" role
2. View products (read-only)
3. View sales summary with transaction history

### As an Admin
1. Select "Admin" role
2. View products
3. View sales summary
4. Add new products using the Admin Panel at the bottom

## 📝 Code Features

- ✅ **Simple & Readable**: Beginner-friendly code with clear comments
- ✅ **No Database**: All data stored in-memory
- ✅ **No Authentication**: Uses request headers for role (for learning purposes)
- ✅ **No ORM**: Direct service logic
- ✅ **Minimal Dependencies**: Only essential packages
- ✅ **Functional Components**: React uses only functional components with hooks
- ✅ **RBAC**: Role-based access control with decorators and guards

## 🎓 Learning Points

### Backend (NestJS)
- Module-based architecture
- Controllers and Services
- Decorators and Guards
- Role-based access control
- Request/Response handling
- CORS configuration

### Frontend (React)
- Functional components with hooks
- State management with useState
- Side effects with useEffect
- API integration with fetch
- Conditional rendering
- Component composition

## 🚀 Future Enhancements

- Add database support (MongoDB/PostgreSQL)
- Implement JWT authentication
- Add product categories
- Add discount system
- Add receipt printing
- Add inventory alerts
- Add user dashboard

## 📄 License

MIT License - Feel free to use this for learning purposes!
