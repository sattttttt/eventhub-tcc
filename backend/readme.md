# EventHub Backend REST API Documentation

Base URL:  
`https://eventhub-1071529598982.us-central1.run.app/`

## Authentication

### Register
- **POST** `/auth/register`
- **Body:**  
  ```json
  {
    "nama": "Nama Lengkap",
    "email": "email@example.com",
    "password": "password"
  }
  ```
- **Response:**  
  - 201 Created, 409 Email exists, 400 Validation error

### Login
- **POST** `/auth/login`
- **Body:**  
  ```json
  {
    "email": "email@example.com",
    "password": "password"
  }
  ```
- **Response:**  
  - 200 OK, returns `{ accessToken }`
  - 401 Unauthorized

---

## Events

### Get All Events
- **GET** `/events`
- **Query Params:**  
  - `search` (optional): search by event name  
  - `category` (optional): filter by category name
- **Response:**  
  - 200 OK, array of events

### Get Event by ID
- **GET** `/events/:id`
- **Response:**  
  - 200 OK, event object  
  - 404 Not Found

### Create Event
- **POST** `/events`
- **Headers:**  
  - `Authorization: Bearer <token>`
  - `Content-Type: multipart/form-data`
- **Body:**  
  - `nama_acara` (string, required)
  - `deskripsi` (string, required)
  - `tanggal_acara` (datetime, required)
  - `lokasi` (string, required)
  - `poster` (file, required)
- **Response:**  
  - 201 Created, event object  
  - 400 Validation error  
  - 401/403 Unauthorized

### Update Event
- **PUT** `/events/:id`
- **Headers:**  
  - `Authorization: Bearer <token>`
- **Body:**  
  ```json
  {
    "nama_acara": "Nama Baru",
    "deskripsi": "Deskripsi Baru",
    "tanggal_acara": "2024-06-01T10:00:00.000Z",
    "lokasi": "Lokasi Baru"
  }
  ```
- **Response:**  
  - 200 OK  
  - 403 Forbidden (not owner)  
  - 404 Not Found

### Delete Event
- **DELETE** `/events/:id`
- **Headers:**  
  - `Authorization: Bearer <token>`
- **Response:**  
  - 200 OK  
  - 403 Forbidden (not owner)  
  - 404 Not Found

---

## Event Registration

### Register for Event
- **POST** `/events/:id/register`
- **Headers:**  
  - `Authorization: Bearer <token>`
- **Response:**  
  - 201 Created  
  - 409 Already registered  
  - 404 Event not found

### Cancel Registration
- **DELETE** `/events/:id/register`
- **Headers:**  
  - `Authorization: Bearer <token>`
- **Response:**  
  - 200 OK  
  - 404 Not registered

---

## User

### Get My Registered Events
- **GET** `/users/me/events`
- **Headers:**  
  - `Authorization: Bearer <token>`
- **Response:**  
  - 200 OK, array of events

---

## Categories

### Get All Categories
- **GET** `/categories`
- **Response:**  
  - 200 OK, array of categories

---

## Error Response Format

```json
{
  "message": "Error message here",
  "error": "Optional error details"
}
```

---

## Notes

- All protected routes require JWT token in the `Authorization` header.
- Dates use ISO 8601 format.
- File upload uses multipart/form-data.

---

For more details, see the controller and route files in [backend/routes/](backend/routes/) and [backend/controller/](backend/controller/).