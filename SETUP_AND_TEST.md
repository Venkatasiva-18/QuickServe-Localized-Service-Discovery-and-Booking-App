# Service Spot - Setup & Testing Guide

## Quick Start

### Option 1: Automated Start (Windows)
Double-click: `START_APPLICATION.bat`

This will:
1. Start backend (port 8080)
2. Start frontend (port 5173)
3. Open both in new terminal windows

### Option 2: Manual Start

#### Terminal 1 - Backend
```bash
cd c:\Users\Admin\Desktop\service-spot\backend
mvn spring-boot:run
```

#### Terminal 2 - Frontend
```bash
cd c:\Users\Admin\Desktop\service-spot\frontend
npm run dev
```

---

## Testing the Application

### 1. **Book Service Page** (All Services Display)
1. Open: `http://localhost:5173`
2. Click "Login" → Select "Customer"
3. Use any test credentials to login
4. Click "Book Service" in navbar
5. **Expected**: Services automatically load from backend with:
   - Category dropdown filter
   - City search filter
   - Service cards showing ratings, price, provider

### 2. **Auto-Initialize Demo Data**
When first accessing Book Service page:
- If no services exist, page auto-initializes demo data
- **Waiting time**: ~5-10 seconds
- **Watch console**: Open browser DevTools (F12) → Console tab
- You'll see log messages:
  ```
  "No services found. Initializing demo data..."
  "Demo data initialized!"
  ```

### 3. **Manual Data Initialization** (If needed)
```bash
curl -X POST http://localhost:8080/api/init/demo-data
```

Response should be:
```json
{
  "success": true,
  "message": "Demo data initialized successfully",
  "services_created": 6,
  "providers_created": 3,
  "categories_created": 4
}
```

### 4. **Verify Backend has Data**
```bash
curl http://localhost:8080/api/services
```

Should return array of services with this structure:
```json
[
  {
    "id": 1,
    "name": "Service Name",
    "price": 500.0,
    "city": "Hyderabad",
    "state": "Telangana",
    "rating": 4.5,
    "reviewCount": 25,
    "category": {
      "id": 1,
      "name": "Category Name"
    },
    "provider": {
      "id": 1,
      "name": "Provider Name",
      "verified": true
    }
  }
]
```

---

## Features Implemented

### ✅ Admin Login (with Built-in Credentials)
- Email: `admin@servicespot.com`
- Password: `admin123`
- Access: `/login-admin` → `/admin-dashboard`

### ✅ Book Service Page
- **Category Dropdown**: Filter services by category
- **City Search**: Filter by location
- **Service Cards**: Display all service details
  - Name, Description, Price
  - Location, Ratings, Reviews
  - Provider name and verification status
- **Auto-load Services**: Fetches from backend
- **Loading State**: Shows spinner while loading
- **Error State**: Shows error with retry button
- **Service Selection**: Select service → Date/Time → Confirm booking

### ✅ Provider Dashboard
- View profile information
- Add new services with category selection
- Edit/Delete services
- See service ratings and reviews
- Logout functionality

### ✅ Service Management
- Create services with full details
- Category-based classification
- Price and location information
- Rating and review tracking

---

## Troubleshooting

### Issue: "Services not displaying"
**Solution:**
1. Check browser console (F12 → Console)
2. Verify backend is running: `curl http://localhost:8080/api/services`
3. If backend returns empty `[]`:
   - Initialize demo data: `curl -X POST http://localhost:8080/api/init/demo-data`
4. Refresh frontend page

### Issue: "Blank page loading"
**Solution:**
1. Open DevTools (F12) → Console
2. Check for errors in red
3. Verify URLs are correct:
   - Backend: `http://localhost:8080`
   - Frontend: `http://localhost:5173`
4. Restart both services

### Issue: "Backend connection refused"
**Solution:**
1. Start backend first in separate terminal
2. Wait 10 seconds for Spring Boot to fully start
3. Test: `curl http://localhost:8080/api/category`
4. If fails, check port 8080 is not in use

### Issue: "Categories not loading"
**Solution:**
1. Backend must have categories
2. Check: `curl http://localhost:8080/api/category`
3. If empty, initialize: `curl -X POST http://localhost:8080/api/init/demo-data`

---

## API Endpoints Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/services` | GET | Get all services |
| `/api/category` | GET | Get all categories |
| `/api/admin/login` | POST | Admin authentication |
| `/api/provider/{id}` | GET | Get provider details |
| `/api/services/provider/{id}` | GET | Get provider's services |
| `/api/init/demo-data` | POST | Initialize demo data |

---

## Database Information

**Database**: MySQL  
**URL**: `jdbc:mysql://localhost:3306/servicespot`  
**User**: `root`  
**Password**: `12345`  
**Hibernate**: `create-drop` (auto-creates tables)

---

## Build Commands

### Backend
```bash
cd backend
mvn clean compile      # Compile only
mvn spring-boot:run    # Run application
mvn clean install      # Full build
```

### Frontend
```bash
cd frontend
npm install            # Install dependencies
npm run dev           # Development mode
npm run build         # Production build
npm run lint          # Check code quality
```

---

## Expected Data Structure

### Sample Service Response
```json
{
  "id": 1,
  "name": "Electrical Wiring Installation",
  "description": "Professional electrical wiring installation",
  "price": 500.0,
  "city": "Hyderabad",
  "state": "Telangana",
  "pincode": 500001,
  "rating": 4.5,
  "reviewCount": 25,
  "isActive": true,
  "category": {
    "id": 1,
    "name": "Electrician",
    "description": "Electrical services"
  },
  "provider": {
    "id": 1,
    "name": "Raj Kumar",
    "email": "raj@example.com",
    "phone": "9999999991",
    "city": "Hyderabad",
    "serviceType": "Electrician",
    "price": 500.0,
    "verified": true
  }
}
```

---

## Notes

- ✅ All services include provider information
- ✅ All services include category information
- ✅ Demo data is automatically initialized on first request
- ✅ Frontend has proper error handling and loading states
- ✅ Responsive design works on all screen sizes
- ✅ Filtering updates in real-time

---

For issues, check:
1. **Browser Console** (F12 → Console tab)
2. **Backend Logs** (Maven output)
3. **Network Tab** (F12 → Network tab) - Check API calls
4. **Database** - Verify MySQL is running
