# Complete API Specification

## Base URL
```
http://localhost:5000
```

## Authentication Headers
All protected endpoints require:
```
Content-Type: application/json
Authorization: Bearer {{accessToken}}
```

---

## 1. INVOICE APIs

### 1.1 Create Invoice
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

### 1.2 Get All Invoices
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

### 1.3 Get Invoice by ID
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

### 1.4 Search Invoices
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

### 1.5 Delete Invoice
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

### 1.6 Get Next Invoice Number
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

## 2. SUPPLIER BILL APIs

### 2.1 Create Supplier Bill
**Endpoint:** `POST /api/supplier-bills`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{accessToken}}
```

**Request Payload:**
```json
{
  "id": "SUPP-001-2024",
  "date": "2024-01-15",
  "supplierName": "ABC Furniture Supplies",
  "supplierGSTIN": "29ABCDE1234F1Z5",
  "billNumber": "BILL-001",
  "items": [
    {
      "id": "item-1",
      "description": "Wooden Planks",
      "hsnCode": "4407",
      "quantity": 100,
      "rate": 500,
      "unit": "PCS",
      "taxRate": 18,
      "amount": 50000
    }
  ],
  "subtotal": 50000,
  "cgst": 4500,
  "sgst": 4500,
  "igst": 0,
  "totalTax": 9000,
  "total": 59000,
  "roundOff": 0,
  "finalAmount": 59000,
  "notes": "Raw materials for production"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Supplier bill created successfully",
  "billId": "SUPP-001-2024"
}
```

---

### 2.2 Get All Supplier Bills
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
      "id": "SUPP-001-2024",
      "date": "2024-01-15",
      "supplierName": "ABC Furniture Supplies",
      "supplierGSTIN": "29ABCDE1234F1Z5",
      "billNumber": "BILL-001",
      "items": [...],
      "subtotal": 50000,
      "cgst": 4500,
      "sgst": 4500,
      "igst": 0,
      "totalTax": 9000,
      "total": 59000,
      "roundOff": 0,
      "finalAmount": 59000,
      "notes": "Raw materials for production"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 150,
    "itemsPerPage": 50
  }
}
```

---

### 2.3 Delete Supplier Bill
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

## 3. SHOP SETTINGS APIs

### 3.1 Get Shop Settings
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
      "address": "123 Main Street, City, State - 560001",
      "gstin": "29ABCDE1234F1Z5",
      "phone": "080-12345678",
      "email": "branch1@furniturepalace.com"
    },
    "shop2": {
      "name": "Furniture Palace - Branch 2",
      "address": "456 Market Road, City, State - 560002",
      "gstin": "29FGHIJ5678K1L9",
      "phone": "080-87654321",
      "email": "branch2@furniturepalace.com"
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

### 3.2 Update Shop Settings
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
    "address": "123 Main Street, City, State - 560001",
    "gstin": "29ABCDE1234F1Z5",
    "phone": "080-12345678",
    "email": "branch1@furniturepalace.com"
  },
  "shop2": {
    "name": "Furniture Palace - Branch 2",
    "address": "456 Market Road, City, State - 560002",
    "gstin": "29FGHIJ5678K1L9",
    "phone": "080-87654321",
    "email": "branch2@furniturepalace.com"
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

### 3.3 Get Shop Details by ID
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
    "address": "123 Main Street, City, State - 560001",
    "gstin": "29ABCDE1234F1Z5",
    "phone": "080-12345678",
    "email": "branch1@furniturepalace.com",
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

## 4. DASHBOARD APIs

### 4.1 Get Dashboard Statistics
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
