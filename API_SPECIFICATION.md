# Complete API Specification

## Base URL
```
const BASE_URL = 'https://api.powerfurnitures.com';
```

## Authentication Headers
All protected endpoints require:
```
Content-Type: application/json
Authorization: Bearer {{accessToken}}
```

---

## 1. AUTHENTICATION & USER MANAGEMENT APIs

### 1.1 Login
**Endpoint:** `POST /auth/login`

**Request Payload:**
```json
{
  "mobileNumber": "9876543210",
  "password": "password123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 1.2 Signup
**Endpoint:** `POST /auth/signup`

**Request Payload:**
```json
{
  "name": "John Doe",
  "mobileNumber": "9876543210",
  "password": "password123",
  "email": "john@example.com"
}
```

**Response:**
```
Success (204 No Content or 200 with success message)
```

---

### 1.3 Request Password Reset
**Endpoint:** `POST /auth/request-password-reset`

**Request Payload:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```
OTP sent to your email
```

---

### 1.4 Reset Password
**Endpoint:** `POST /auth/reset-password`

**Request Payload:**
```json
{
  "email": "john@example.com",
  "otp": "144180",
  "newPassword": "NewStrongPassword321"
}
```

**Response:**
```
Success (204 No Content or 200 with success message)
```

---

### 1.5 Get User Profile
**Endpoint:** `GET /user/profile`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{accessToken}}
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "mobileNumber": "9876543210",
  "roles": "SUPERADMIN",
  "email": "john@example.com",
  "profileImg": "https://your-bucket.s3.ap-south-1.amazonaws.com/profile-images/user-123.jpg"
}
```

---

### 1.6 Update User Profile
**Endpoint:** `PUT /user/edit`

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: multipart/form-data
```

**Request Payload (FormData):**
```
mobileNumber: "9876543210"
name: "John Updated"
email: "johnupdated@example.com"
profileImgFile: [File object] (optional)
removeProfileImg: "false" (optional, "true" to delete profile image)
```

**Response:**
```
Success (204 No Content or 200 with success message)
```

**Notes:**
- Profile image is uploaded to AWS S3
- If `removeProfileImg` is "true", profile image is deleted from S3
- Profile image returned as S3 URL in subsequent profile fetches

---

### 1.7 Delete Profile Image
**Endpoint:** `PUT /user/edit`

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: multipart/form-data
```

**Request Payload (FormData):**
```
mobileNumber: "9876543210"
removeProfileImg: "true"
```

**Response:**
```
Success (204 No Content or 200 with success message)
```

---

### 1.8 Get All Users (SUPERADMIN only)
**Endpoint:** `GET /user/all`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{accessToken}}
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "mobileNumber": "9876543210",
    "roles": "SUPERADMIN",
    "email": "john@example.com"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "mobileNumber": "9876543211",
    "roles": "ADMIN",
    "email": "jane@example.com"
  }
]
```

---

### 1.9 Update User Role (SUPERADMIN only)
**Endpoint:** `POST /auth/update-role`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{accessToken}}
```

**Request Payload:**
```json
{
  "mobileNumber": "9876543210",
  "roles": "ADMIN"
}
```

**Response:**
```
Success (204 No Content or 200 with success message)
```

**Valid Role Values:**
- `SUPERADMIN`
- `ADMIN`
- `USER`

---

### 1.10 Update User (SUPERADMIN/ADMIN only)
**Endpoint:** `PUT /user/{id}`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{accessToken}}
```

**Request Payload:**
```json
{
  "name": "John Updated",
  "email": "johnupdated@example.com",
  "mobileNumber": "9876543210"
}
```

**Response:**
```
Success (204 No Content or 200 with success message)
```

---

### 1.9 Delete User (SUPERADMIN only)
**Endpoint:** `DELETE /user/{id}`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{accessToken}}
```

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

---

## 2. INVOICE APIs

### 2.1 Create Invoice
**Endpoint:** `POST /api/invoices`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{accessToken}}
```

**Request Payload:**
```json
{
  "id": "INV-001-2024",
  "invoiceNumber": "001",
  "date": "2024-01-15",
  "time": "10:30:00",
  "customerName": "John Doe",
  "customerAddress": "123 Main St, City",
  "customerPhone": "9876543210",
  "customerGSTIN": "29ABCDE1234F1Z5",
  "shopId": "shop1",
  "items": [
    {
      "id": "item-1",
      "description": "Wooden Chair",
      "hsnCode": "9401",
      "quantity": 2,
      "rate": 5000,
      "unit": "PCS",
      "taxRate": 18
    }
  ],
  "vehicleNumber": "KA01AB1234",
  "transportMode": "Road",
  "distance": 150,
  "transporterId": "TRANS123",
  "transporterName": "ABC Transport",
  "ewayBillNumber": "EWB123456789",
  "subtotal": 10000,
  "cgst": 900,
  "sgst": 900,
  "igst": 0,
  "totalTax": 1800,
  "total": 11800,
  "roundOff": 0,
  "finalAmount": 11800
}
```

**Response:**
```json
{
  "success": true,
  "message": "Invoice created successfully",
  "invoiceId": "INV-001-2024"
}
```

---

### 2.2 Get All Invoices
**Endpoint:** `GET /api/invoices`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{accessToken}}
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)
- `sortBy` (optional): Field to sort by (default: "date")
- `sortOrder` (optional): "asc" or "desc" (default: "desc")

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "INV-001-2024",
      "invoiceNumber": "001",
      "date": "2024-01-15",
      "time": "10:30:00",
      "customerName": "John Doe",
      "customerAddress": "123 Main St, City",
      "customerPhone": "9876543210",
      "customerGSTIN": "29ABCDE1234F1Z5",
      "shopId": "shop1",
      "items": [...],
      "vehicleNumber": "KA01AB1234",
      "transportMode": "Road",
      "distance": 150,
      "transporterId": "TRANS123",
      "transporterName": "ABC Transport",
      "ewayBillNumber": "EWB123456789",
      "subtotal": 10000,
      "cgst": 900,
      "sgst": 900,
      "igst": 0,
      "totalTax": 1800,
      "total": 11800,
      "roundOff": 0,
      "finalAmount": 11800
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 250,
    "itemsPerPage": 50
  }
}
```

---

### 2.3 Get Invoice by ID
**Endpoint:** `GET /api/invoices/:id`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{accessToken}}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "INV-001-2024",
    "invoiceNumber": "001",
    "date": "2024-01-15",
    "time": "10:30:00",
    "customerName": "John Doe",
    "customerAddress": "123 Main St, City",
    "customerPhone": "9876543210",
    "customerGSTIN": "29ABCDE1234F1Z5",
    "shopId": "shop1",
    "items": [...],
    "vehicleNumber": "KA01AB1234",
    "transportMode": "Road",
    "distance": 150,
    "transporterId": "TRANS123",
    "transporterName": "ABC Transport",
    "ewayBillNumber": "EWB123456789",
    "subtotal": 10000,
    "cgst": 900,
    "sgst": 900,
    "igst": 0,
    "totalTax": 1800,
    "total": 11800,
    "roundOff": 0,
    "finalAmount": 11800
  }
}
```

---

### 2.4 Search Invoices
**Endpoint:** `GET /api/invoices/search`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{accessToken}}
```

**Query Parameters:**
- `query` (required): Search term (customer name, invoice number, etc.)
- `dateFrom` (optional): Start date (YYYY-MM-DD)
- `dateTo` (optional): End date (YYYY-MM-DD)
- `shopId` (optional): Filter by shop

**Example:** `/api/invoices/search?query=John&dateFrom=2024-01-01&dateTo=2024-12-31`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "INV-001-2024",
      "invoiceNumber": "001",
      "date": "2024-01-15",
      "customerName": "John Doe",
      "finalAmount": 11800
    }
  ],
  "count": 1
}
```

---

### 2.5 Delete Invoice
**Endpoint:** `DELETE /api/invoices/:id`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{accessToken}}
```

**Response:**
```json
{
  "success": true,
  "message": "Invoice deleted successfully"
}
```

---

### 2.6 Get Next Invoice Number
**Endpoint:** `GET /api/invoices/next-number`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{accessToken}}
```

**Query Parameters:**
- `shopId` (optional): Get next number for specific shop

**Response:**
```json
{
  "success": true,
  "nextNumber": "002"
}
```

---

## 3. SUPPLIER BILL APIs

### 3.1 Create Supplier Bill
**Endpoint:** `POST /api/supplier-bills`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{accessToken}}
```

**Request Payload:**
```json
{
  "id": "95f342f6-4ce8-404d-b6e6-6d36c1453944",
  "supplierName": "Test supplier",
  "description": "Test description",
  "purchaseDate": "2025-11-04",
  "files": [
    {
      "name": "Print Invoice.pdf",
      "type": "application/pdf",
      "dataUrl": "data:application/pdf;base64,JVBERi0xLjQKJdPr6eE..."
    },
    {
      "name": "invoice-image.jpg",
      "type": "image/jpeg",
      "dataUrl": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD..."
    }
  ],
  "createdAt": "2025-11-11T06:21:52.048Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Supplier bill created successfully",
  "billId": "95f342f6-4ce8-404d-b6e6-6d36c1453944"
}
```

---

### 3.2 Get All Supplier Bills
**Endpoint:** `GET /api/supplier-bills`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{accessToken}}
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)
- `sortBy` (optional): Field to sort by (default: "date")
- `sortOrder` (optional): "asc" or "desc" (default: "desc")

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "95f342f6-4ce8-404d-b6e6-6d36c1453944",
      "supplierName": "Test supplier",
      "description": "Test description",
      "purchaseDate": "2025-11-04",
      "createdAt": "2025-11-11T06:21:52.048Z",
      "files": [
        {
          "id": 1,
          "name": "Print Invoice.pdf",
          "type": "application/pdf",
          "url": "https://your-bucket.s3.ap-south-1.amazonaws.com/supplier-bills/95f342f6-4ce8-404d-b6e6-6d36c1453944/Print%20Invoice.pdf"
        },
        {
          "id": 2,
          "name": "invoice-image.jpg",
          "type": "image/jpeg",
          "url": "https://your-bucket.s3.ap-south-1.amazonaws.com/supplier-bills/95f342f6-4ce8-404d-b6e6-6d36c1453944/invoice-image.jpg"
        }
      ]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1,
    "itemsPerPage": 50
  }
}
```

---

### 3.3 Delete Supplier Bill
**Endpoint:** `DELETE /api/supplier-bills/:id`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{accessToken}}
```

**Response:**
```json
{
  "success": true,
  "message": "Supplier bill deleted successfully"
}
```

---

## 4. SHOP SETTINGS APIs

### 4.1 Get Shop Settings
**Endpoint:** `GET /api/shop-settings`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{accessToken}}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "shop1": {
      "name": "Furniture Palace - Branch 1",
      "address": "123 Main Street",
      "city": "Bangalore",
      "state": "Karnataka",
      "pincode": "560001",
      "gstin": "29ABCDE1234F1Z5",
      "email": "branch1@furniturepalace.com",
      "phones": ["080-12345678", "080-12345679", "9876543210", "9876543211"]
    },
    "shop2": {
      "name": "Furniture Palace - Branch 2",
      "address": "456 Market Road",
      "city": "Bangalore",
      "state": "Karnataka",
      "pincode": "560002",
      "gstin": "29FGHIJ5678K1L9",
      "email": "branch2@furniturepalace.com",
      "phones": ["080-87654321", "080-87654322", "9876543212", "9876543213"]
    },
    "bankDetails": {
      "accountName": "Furniture Palace Pvt Ltd",
      "accountNumber": "1234567890",
      "ifscCode": "BANK0001234",
      "bankName": "State Bank",
      "branch": "Main Branch"
    }
  }
}
```

---

### 4.2 Update Shop Settings
**Endpoint:** `PUT /api/shop-settings`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{accessToken}}
```

**Request Payload:**
```json
{
  "shop1": {
    "name": "Furniture Palace - Branch 1",
    "address": "123 Main Street",
    "city": "Bangalore",
    "state": "Karnataka",
    "pincode": "560001",
    "gstin": "29ABCDE1234F1Z5",
    "email": "branch1@furniturepalace.com",
    "phones": ["080-12345678", "080-12345679", "9876543210", "9876543211"]
  },
  "shop2": {
    "name": "Furniture Palace - Branch 2",
    "address": "456 Market Road",
    "city": "Bangalore",
    "state": "Karnataka",
    "pincode": "560002",
    "gstin": "29FGHIJ5678K1L9",
    "email": "branch2@furniturepalace.com",
    "phones": ["080-87654321", "080-87654322", "9876543212", "9876543213"]
  },
  "bankDetails": {
    "accountName": "Furniture Palace Pvt Ltd",
    "accountNumber": "1234567890",
    "ifscCode": "BANK0001234",
    "bankName": "State Bank",
    "branch": "Main Branch"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Shop settings updated successfully"
}
```

---

### 4.3 Get Shop Details by ID
**Endpoint:** `GET /api/shop-settings/:shopId`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{accessToken}}
```

**Example:** `/api/shop-settings/shop1`

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "Furniture Palace - Branch 1",
    "address": "123 Main Street",
    "city": "Bangalore",
    "state": "Karnataka",
    "pincode": "560001",
    "gstin": "29ABCDE1234F1Z5",
    "email": "branch1@furniturepalace.com",
    "phones": ["080-12345678", "080-12345679", "9876543210", "9876543211"],
    "bankDetails": {
      "accountName": "Furniture Palace Pvt Ltd",
      "accountNumber": "1234567890",
      "ifscCode": "BANK0001234",
      "bankName": "State Bank",
      "branch": "Main Branch"
    }
  }
}
```

---

## 5. DASHBOARD APIs

### 5.1 Get Dashboard Statistics
**Endpoint:** `GET /api/dashboard/stats`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{accessToken}}
```

**Query Parameters:**
- `dateFrom` (optional): Start date for filtering (YYYY-MM-DD)
- `dateTo` (optional): End date for filtering (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalInvoices": 250,
    "todaySales": {
      "count": 5,
      "amount": 125000
    },
    "monthlySales": {
      "count": 87,
      "amount": 2500000
    },
    "ewayBillsGenerated": 180,
    "recentInvoices": [
      {
        "id": "INV-001-2024",
        "invoiceNumber": "001",
        "date": "2024-01-15",
        "customerName": "John Doe",
        "finalAmount": 11800
      }
    ]
  }
}
```

---

## Error Response Format

All API errors should follow this format:

```json
{
  "success": false,
  "error": "Error message description",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Common Error Codes:
- `UNAUTHORIZED` (401): Invalid or expired token
- `FORBIDDEN` (403): User doesn't have permission
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Invalid request data
- `SERVER_ERROR` (500): Internal server error

---

## Notes for Backend Implementation:

1. **Authentication**: All endpoints (except auth endpoints) require valid JWT token
2. **Role-Based Access**:
   - USER: Can view only their own invoices/bills
   - ADMIN: Can view and manage all invoices/bills for their assigned shops
   - SUPERADMIN: Full access to all data and settings

3. **Pagination**: Implement cursor-based or offset-based pagination for list endpoints
4. **Filtering**: Support date range and search filters
5. **Validation**: Validate all input data, especially GSTIN format, phone numbers, etc.
6. **Audit Logging**: Log all create, update, delete operations with user info
7. **Data Ownership**: Associate invoices/bills with the user who created them
