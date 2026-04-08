# Finance Manager — API Documentation

## Overview

The Finance Manager API is a RESTful backend built with Express.js and MongoDB. It provides endpoints for authentication, user management, financial record management, and dashboard analytics.

**Localhost Base URL:** `http://localhost:<PORT>`

**Online URL:** `https://finance-manager-n03p.onrender.com`

**Authentication:** JWT-based, delivered via HTTP-only cookies (`token`). Protected routes require a valid, non-expired token cookie.

---

## Roles & Permissions

| Role | Description |
|---|---|
| `viewer` | Can self-register, update own name/password, and delete their own account |
| `analyst` | Can view financial records and dashboard data; can delete their own account |
| `admin` | Full access — manages users, records, and all dashboard data |

---

## Authentication

### POST `/login`

Authenticates a user and issues a JWT cookie.

**Auth Required:** No

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `email_id` | string | Yes | User's email address |
| `password` | string | Yes | Minimum 8 characters |

**Responses:**

| Status | Description |
|---|---|
| `200 OK` | `"Login successful"` — JWT cookie set |
| `400 Bad Request` | Validation errors array |
| `401 Unauthorized` | `"Invalid credentials"` |
| `403 Forbidden` | `"User already logged in"` (valid token already present) |
| `500 Internal Server Error` | Server error message |

---

### DELETE `/logout`

Logs out the current user and clears the JWT cookie.

**Auth Required:** Yes (valid JWT cookie)

**Request Body:** None

**Responses:**

| Status | Description |
|---|---|
| `200 OK` | `"Logged out successfully"` |
| `401 Unauthorized` | `"Unauthorized"` or `"Token expired or invalid"` |
| `500 Internal Server Error` | Server error message |

---

### GET `/me`

Returns the profile of the currently authenticated user.

**Auth Required:** Yes (valid JWT cookie)

**Request Body:** None

**Response `200 OK`:**

```json
{
  "email_id": "user@example.com",
  "name": "Jane Doe",
  "role": "analyst",
  "login_time": "2025-04-07T10:00:00.000Z",
  "logout_time": "2025-04-06T18:00:00.000Z"
}
```

| Status | Description |
|---|---|
| `200 OK` | User object |
| `401 Unauthorized` | `"Unauthorized"` or `"Token expired or invalid"` |
| `500 Internal Server Error` | Server error message |

---

## Users

Base path: `/user`

### POST `/user/viewer`

Self-registration endpoint. Creates a new user with the `viewer` role.

**Auth Required:** No

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `email_id` | string | Yes | Valid email address |
| `name` | string | Yes | Non-empty string |
| `password` | string | Yes | Minimum 8 characters |

**Response `201 Created`:**

```json
{
  "message": "Viewer created successfully",
  "user": {
    "email_id": "newuser@example.com",
    "name": "New User",
    "role": "viewer"
  }
}
```

| Status | Description |
|---|---|
| `201 Created` | User created |
| `400 Bad Request` | Validation errors array |
| `500 Internal Server Error` | Server error message |

---

### POST `/user`

Creates a new user with a specified role. Admin-only.

**Auth Required:** Yes — `admin` role

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `email_id` | string | Yes | Valid email address |
| `name` | string | Yes | Non-empty string |
| `password` | string | Yes | Minimum 8 characters |
| `role` | string | No | `viewer`, `analyst`, or `admin` (defaults to `viewer`) |

**Response `201 Created`:**

```json
{
  "message": "User created successfully",
  "user": {
    "email_id": "analyst@example.com",
    "name": "New Analyst",
    "role": "analyst"
  }
}
```

| Status | Description |
|---|---|
| `201 Created` | User created |
| `400 Bad Request` | Validation errors array |
| `401 Unauthorized` | Not authenticated |
| `403 Forbidden` | Insufficient role |
| `500 Internal Server Error` | Server error message |

---

### GET `/user`

Returns a paginated list of all users. Admin-only.

**Auth Required:** Yes — `admin` role

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `role` | string | No | Filter by role: `viewer`, `analyst`, or `admin` |
| `limit` | number | No | Number of results per page |
| `page` | number | No | Page number (1-indexed) |

**Response `200 OK`:** Array of user objects (paginated).

| Status | Description |
|---|---|
| `200 OK` | User list |
| `400 Bad Request` | Validation errors |
| `401 Unauthorized` | Not authenticated |
| `403 Forbidden` | Insufficient role |
| `500 Internal Server Error` | Server error message |

---

### GET `/user/:email_id`

Fetches a single user by email address. Admin-only.

**Auth Required:** Yes — `admin` role

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `email_id` | string | Valid email address of the target user |

**Response `200 OK`:**

```json
{
  "email_id": "user@example.com",
  "name": "Jane Doe",
  "role": "analyst"
}
```

| Status | Description |
|---|---|
| `200 OK` | User object |
| `400 Bad Request` | Validation errors |
| `401 Unauthorized` | Not authenticated |
| `403 Forbidden` | Insufficient role |
| `404 Not Found` | `"User not found"` |
| `500 Internal Server Error` | Server error message |

---

### PUT `/user/nameChange`

Updates the display name of the currently authenticated user.

**Auth Required:** Yes (any role)

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | New non-empty name |

**Response `200 OK`:**

```json
{
  "message": "Name changed successfully",
  "user": { ... }
}
```

| Status | Description |
|---|---|
| `200 OK` | Updated user object |
| `400 Bad Request` | Validation errors |
| `401 Unauthorized` | `"Unauthorized"` or `"Token expired or invalid"` |
| `500 Internal Server Error` | Server error message |

---

### PUT `/user/passwordChange`

Updates the password of the currently authenticated user.

**Auth Required:** Yes (any role)

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `email_id` | string | Yes | Must match the logged-in user's email |
| `password` | string | Yes | New password, minimum 8 characters |

**Response `200 OK`:**

```json
{
  "message": "Password changed successfully",
  "user": { ... }
}
```

| Status | Description |
|---|---|
| `200 OK` | Updated user object |
| `400 Bad Request` | Validation errors |
| `401 Unauthorized` | `"Unauthorized"` or `"Token expired or invalid"` |
| `500 Internal Server Error` | Server error message |

---

### PUT `/user/roleChange`

Changes the role of any user. Admin-only.

**Auth Required:** Yes — `admin` role

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `email_id` | string | Yes | Email of the user to update |
| `role` | string | Yes | New role: `viewer`, `analyst`, or `admin` |

**Response `200 OK`:**

```json
{
  "message": "Role changed successfully",
  "user": { ... }
}
```

| Status | Description |
|---|---|
| `200 OK` | Updated user object |
| `400 Bad Request` | Validation errors |
| `401 Unauthorized` | Not authenticated |
| `403 Forbidden` | Insufficient role |
| `500 Internal Server Error` | Server error message |

---

### DELETE `/user`

Deletes the currently authenticated user's own account. Available to `viewer` and `analyst` roles only (admins cannot self-delete via this endpoint to protect system integrity and avoid accidental lockout).

**Auth Required:** Yes — `viewer` or `analyst` role

**Request Body:** None

**Responses:**

| Status | Description |
|---|---|
| `200 OK` | `"User deleted successfully"` |
| `401 Unauthorized` | `"Unauthorized"` or `"Token expired or invalid"` |
| `403 Forbidden` | Insufficient role |
| `500 Internal Server Error` | Server error message |

---

## Records

Base path: `/records`

### POST `/records`

Creates a new financial record. Admin-only.

**Auth Required:** Yes — `admin` role

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `amount` | number | Yes | Transaction amount |
| `type` | string | Yes | `income` or `expense` |
| `category` | string | Yes | Category label (e.g. `"salary"`, `"rent"`) |
| `date` | string | Yes | Date in `YYYY-MM-DD` format |
| `notes` | string | No | Optional notes |

**Response `201 Created`:**

```json
{
  "message": "Record created successfully",
  "record": {
    "_id": 1001,
    "amount": 5000,
    "type": "income",
    "category": "salary",
    "date": "2025-04-01T00:00:00.000Z",
    "notes": "April salary"
  }
}
```

| Status | Description |
|---|---|
| `201 Created` | Record created |
| `400 Bad Request` | Validation errors array |
| `401 Unauthorized` | Not authenticated |
| `403 Forbidden` | Insufficient role |
| `500 Internal Server Error` | Server error message |

---

### GET `/records`

Returns a paginated, filterable list of financial records.

**Auth Required:** Yes — `analyst` or `admin` role

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `type` | string | No | Filter by `income` or `expense` |
| `category` | string | No | Filter by category name |
| `startDate` | string | No | Filter records on or after date (`YYYY-MM-DD`) |
| `endDate` | string | No | Filter records on or before date (`YYYY-MM-DD`) |
| `limit` | number | No | Results per page |
| `page` | number | No | Page number (1-indexed) |

**Response `200 OK`:** Array of record objects (paginated).

| Status | Description |
|---|---|
| `200 OK` | Records array |
| `400 Bad Request` | Validation errors |
| `401 Unauthorized` | Not authenticated |
| `403 Forbidden` | Insufficient role |
| `500 Internal Server Error` | Server error message |

---

### GET `/records/:id`

Fetches a single record by its numeric ID.

**Auth Required:** Yes — `analyst` or `admin` role

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | number | Numeric record ID |

**Response `200 OK`:**

```json
{
  "_id": 1001,
  "amount": 5000,
  "type": "income",
  "category": "salary",
  "date": "2025-04-01T00:00:00.000Z",
  "notes": "April salary"
}
```

| Status | Description |
|---|---|
| `200 OK` | Record object |
| `400 Bad Request` | Validation errors |
| `401 Unauthorized` | Not authenticated |
| `403 Forbidden` | Insufficient role |
| `404 Not Found` | `"Record not found"` |
| `500 Internal Server Error` | Server error message |

---

### PUT `/records/:id`

Updates an existing record by ID. All fields are optional — only provided fields are updated. Admin-only.

**Auth Required:** Yes — `admin` role

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | number | Numeric record ID |

**Request Body (all optional):**

| Field | Type | Description |
|---|---|---|
| `amount` | number | Updated amount |
| `type` | string | `income` or `expense` |
| `category` | string | Updated category |
| `date` | string | Updated date in `YYYY-MM-DD` format |

**Response `200 OK`:**

```json
{
  "message": "Record updated successfully",
  "record": { ... }
}
```

| Status | Description |
|---|---|
| `200 OK` | Updated record |
| `400 Bad Request` | Validation errors |
| `401 Unauthorized` | Not authenticated |
| `403 Forbidden` | Insufficient role |
| `500 Internal Server Error` | Server error message |

---

### DELETE `/records/:id`

Deletes a record by its numeric ID. Admin-only.

**Auth Required:** Yes — `admin` role

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | number | Numeric record ID |

**Responses:**

| Status | Description |
|---|---|
| `200 OK` | `"Record deleted successfully"` |
| `400 Bad Request` | Validation errors |
| `401 Unauthorized` | Not authenticated |
| `403 Forbidden` | Insufficient role |
| `404 Not Found` | `"Record not found"` |
| `500 Internal Server Error` | Server error message |

---

## Dashboard

All dashboard endpoints aggregate data from the records collection. Any authenticated user can access them.

### GET `/total/income`

Returns the sum of all income records.

**Auth Required:** Yes (any role)

**Response `200 OK`:**

```json
{
  "totalIncome": 25000
}
```

| Status | Description |
|---|---|
| `200 OK` | Total income object |
| `401 Unauthorized` | Not authenticated |
| `500 Internal Server Error` | Server error message |

---

### GET `/total/expense`

Returns the sum of all expense records.

**Auth Required:** Yes (any role)

**Response `200 OK`:**

```json
{
  "totalExpense": 12000
}
```

| Status | Description |
|---|---|
| `200 OK` | Total expense object |
| `401 Unauthorized` | Not authenticated |
| `500 Internal Server Error` | Server error message |

---

### GET `/total`

Returns the net balance (total income minus total expenses).

**Auth Required:** Yes (any role)

**Response `200 OK`:**

```json
{
  "netBalance": 13000
}
```

| Status | Description |
|---|---|
| `200 OK` | Net balance object |
| `401 Unauthorized` | Not authenticated |
| `500 Internal Server Error` | Server error message |

---

### GET `/categories`

Returns income and expense totals broken down by category.

**Auth Required:** Yes (any role)

**Response `200 OK`:** Array of category summary objects. Each object includes whichever of `totalIncome` or `totalExpense` are non-zero for that category.

```json
[
  {
    "category": "salary",
    "totalIncome": 20000
  },
  {
    "category": "rent",
    "totalExpense": 8000
  },
  {
    "category": "freelance",
    "totalIncome": 5000,
    "totalExpense": 500
  }
]
```

| Status | Description |
|---|---|
| `200 OK` | Array of category summaries |
| `401 Unauthorized` | Not authenticated |
| `500 Internal Server Error` | Server error message |

---

## Data Models

### User

| Field | Type | Notes |
|---|---|---|
| `email_id` | String | Unique, required |
| `name` | String | Required |
| `password` | String | Hashed, required |
| `role` | String | `viewer` \| `analyst` \| `admin`; default `viewer` |
| `login_time` | Date | Set on login |
| `logout_time` | Date | Set on logout |
| `last_active` | Date | Activity tracking |

### Record

| Field | Type | Notes |
|---|---|---|
| `_id` | Number | Numeric auto-assigned ID |
| `amount` | Number | Required |
| `type` | String | `income` or `expense`, required |
| `category` | String | Required |
| `date` | Date | Required |
| `notes` | String | Optional |

---

## Error Format

Validation errors return an array of error objects from `express-validator`:

```json
[
  {
    "type": "field",
    "msg": "Invalid Email Address.",
    "path": "email_id",
    "location": "body"
  }
]
```

All other errors return a plain string message:

```json
"Invalid credentials"
```
