# Finance Manager API

A RESTful backend API for managing personal or organizational finances. Built with **Node.js**, **Express.js**, and **MongoDB**, it supports role-based access control, JWT authentication, financial record tracking, and dashboard analytics.

---

## Features

- **JWT Authentication** via HTTP-only cookies (2-minute token expiry)
- **Role-Based Access Control** with three roles: `viewer`, `analyst`, and `admin`
- **User Management** — create, update, and delete users with role assignment
- **Financial Records** — create, read, update, and delete income/expense transactions
- **Dashboard Analytics** — total income, total expense, net balance, and category-wise breakdowns
- **Pagination & Filtering** on list endpoints
- **Input Validation** using `express-validator`
- **Password Hashing** with `bcrypt`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM modules) |
| Framework | Express.js v5 |
| Database | MongoDB (via Mongoose) |
| Auth | JSON Web Tokens (`jsonwebtoken`) |
| Validation | `express-validator` |
| Password Hashing | `bcrypt` |
| Dev Server | `nodemon` |

---

## Project Structure

```
src/
├── index.mjs                  # Entry point — starts the server
├── app.mjs                    # Express app setup, middleware, routes
├── controllers/
│   ├── authController.mjs     # Login, logout, me
│   ├── userController.mjs     # User CRUD
│   ├── recordController.mjs   # Financial record CRUD
│   └── dashboardController.mjs# Analytics endpoints
├── routes/
│   ├── authRoutes.mjs
│   ├── userRoutes.mjs
│   ├── recordRoutes.mjs
│   └── dashboardRoutes.mjs
├── middleware/
│   └── authMiddleware.mjs     # protect (auth check) + authorize (role check)
├── models/
│   ├── userModels.mjs
│   └── recordModels.mjs
├── services/
│   ├── userServices.mjs
│   ├── recordServices.mjs
│   └── dashboardServices.mjs
├── validations/
│   ├── userValidations.mjs
│   ├── recordValidations.mjs
│   └── pageValidations.mjs
└── utils/
    ├── authUtils.mjs          # Token generation, password hashing
    ├── constants.mjs          # Roles, transaction types, JWT config
    ├── getId.mjs              # Record ID generation
    └── page.mjs               # Pagination helper
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd finance-manager

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

| Variable | Description |
|---|---|
| `PORT` | Port the server listens on (default: `3000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key used to sign JWTs |

> **Note:** In production, set `secure: true` on the cookie in `authUtils.mjs` to enforce HTTPS-only delivery.

### Running the Server

```bash
# Production
npm start

# Development (with hot reload via nodemon)
npm run dev
```

The server will start on `http://localhost:<PORT>`.

### Admin credentials

Use these sample admin credentials to test all admin API:

```
{
  "email_id": "testadmin@test.com",
  "password": "Admin123"
}
```

---

## API Overview

All endpoints are documented in detail in [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md) and [`apiDocs.html`](./src/public/apiDocs.html).

### Base URL

```
http://localhost:4000
```



### Route Summary

| Method | Endpoint | Role Required | Description |
|---|---|---|---|
| `POST` | `/login` | None | Authenticate and receive JWT cookie |
| `DELETE` | `/logout` | Authenticated | Clear JWT cookie |
| `GET` | `/me` | Authenticated | Get current user's profile |
| `POST` | `/user/viewer` | None | Self-register as a viewer |
| `POST` | `/user` | admin | Create a user with any role |
| `GET` | `/user` | admin | List all users (paginated) |
| `GET` | `/user/:email_id` | admin | Get a user by email |
| `PUT` | `/user/nameChange` | Authenticated | Update own display name |
| `PUT` | `/user/passwordChange` | Authenticated | Update own password |
| `PUT` | `/user/roleChange` | admin | Change a user's role |
| `DELETE` | `/user` | viewer, analyst | Delete own account |
| `POST` | `/records` | admin | Create a financial record |
| `GET` | `/records` | analyst, admin | List records (filterable, paginated) |
| `GET` | `/records/:id` | analyst, admin | Get a record by ID |
| `PUT` | `/records/:id` | admin | Update a record |
| `DELETE` | `/records/:id` | admin | Delete a record |
| `GET` | `/total/income` | Authenticated | Sum of all income |
| `GET` | `/total/expense` | Authenticated | Sum of all expenses |
| `GET` | `/total` | Authenticated | Net balance (income − expenses) |
| `GET` | `/categories` | Authenticated | Income/expense totals by category |
| `GET` | `/trends/monthly` | Authenticated | Monthly financial trends |
| `GET` | `/trends/weekly` | Authenticated | Weekly financial trends |
| `GET` | `apiDocs.html` | None | API Documentation |

---

## Roles & Permissions

| Role | Capabilities |
|---|---|
| `viewer` | Self-register, update own name/password, delete own account |
| `analyst` | All viewer capabilities + view records and dashboard data |
| `admin` | Full access — manage all users, records, and analytics |

---

## Authentication Flow

1. Call `POST /login` with `email_id` and `password` — a JWT cookie is set automatically.
2. All subsequent requests include the cookie automatically (browser/cookie-aware clients).
3. Tokens expire after **2 minutes**. Call `POST /login` again to refresh.
4. Call `DELETE /logout` to clear the cookie and record the logout time.

---

## Pagination

List endpoints (`GET /user`, `GET /records`) support pagination via query parameters:

| Parameter | Type | Description |
|---|---|---|
| `limit` | number | Results per page |
| `page` | number | Page number (1-indexed) |

Paginated responses include:

```json
{
  "data": [...],
  "total": 42,
  "page": 2,
  "totalPages": 5,
  "hasNextPage": true,
  "hasPrevPage": true
}
```

If `limit` is omitted, all results are returned along with a `total` count.

---

## Dependencies

```json
{
  "bcrypt": "^6.0.0",
  "cookie-parser": "^1.4.7",
  "cors": "^2.8.6",
  "dotenv": "^17.4.0",
  "express": "^5.2.1",
  "express-validator": "^7.3.2",
  "jsonwebtoken": "^9.0.3",
  "jwt-decode": "^4.0.0",
  "mongoose": "^9.4.1"
}
```

Dev dependencies: `nodemon ^3.1.14`

---

## License

ISC
