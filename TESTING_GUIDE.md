# Service Spot - Complete Testing Guide

## 🚀 PRE-TEST SETUP

### 1. Verify MySQL is Running
```bash
# Windows: Check MySQL service is running
# Linux/Mac: Check MySQL is running
mysql -u root -p12345 -e "SELECT 1;"
```

### 2. Start Backend (Terminal 1)
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

**Wait for**: "Application started successfully" message  
**Expected Port**: 8080

### 3. Start Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```

**Expected Port**: 5173  
**Access**: http://localhost:5173

---

## ✅ TEST SCENARIOS

### TEST 1: Admin Login

**Scenario**: Admin credentials work
**Steps**:
1. Go to http://localhost:5173/login-admin
2. Enter:
   - Email: `admin@servicespot.com`
   - Password: `admin123`
3. Click "Login"

**Expected Results**:
- ✅ Login successful message
- ✅ Redirected to /admin-dashboard
- ✅ Navbar shows "Logout" button
- ✅ Admin menu appears in navbar
- ✅ Can access Admin features

**What it tests**: Admin authentication system

---

### TEST 2: Customer Signup & Login

**Scenario**: New customer can register and login
**Steps**:
1. Go to http://localhost:5173/register
2. Click "Customer"
3. Fill all fields:
   - Name: "John Doe"
   - Email: "john@test.com"
   - Password: "test123"
   - Phone: "9999999999"
   - Address details: Fill completely
   - City: "Hyderabad"
   - State: "Telangana"
   - Pincode: "500001"
4. Click "Register"
5. Go to http://localhost:5173/login-customer
6. Enter registered credentials
7. Click "Login"

**Expected Results**:
- ✅ Registration successful
- ✅ Customer created in database
- ✅ Login successful
- ✅ Customer name in navbar
- ✅ Redirected to customer dashboard
- ✅ Customer ID stored in localStorage

**What it tests**: Customer authentication and data persistence

---

### TEST 3: Provider Signup & Services

**Scenario**: Provider registers and creates services
**Steps**:
1. Go to http://localhost:5173/register-provider
2. Fill all provider details:
   - Name: "Tech Services"
   - Email: "tech@provider.com"
   - Password: "pass123"
   - Service Type: "Electrician"
   - Price: "500"
   - Address: (complete)
3. Register
4. Login at /login-provider with credentials
5. Click "Dashboard" in navbar
6. Click "Add New Service"
7. Fill service details:
   - Name: "Home Wiring"
   - Description: "Professional home electrical wiring"
   - Category: "Electrician"
   - Price: "5000"
   - City: "Hyderabad"
   - State: "Telangana"
   - Pincode: "500001"
8. Click "Create Service"

**Expected Results**:
- ✅ Provider registered
- ✅ Provider dashboard loads
- ✅ Services grid shows new service
- ✅ Service has all details visible
- ✅ Service card shows category badge
- ✅ Delete button appears

**What it tests**: Provider registration and service creation

---

### TEST 4: Book Service (Main Feature)

**Scenario**: Customer books a service
**Pre-requisites**: 
- Customer must be logged in
- Services must exist (auto-created or manually added)

**Steps**:
1. Login as customer
2. Click "Book Service" in navbar
3. **Wait 5-10 seconds** (auto-initializes demo data if needed)
4. **Watch browser console** (F12 → Console tab):
   - Should see: "No services found. Initializing demo data..."
   - Then: "Demo data initialized!"
5. Services grid appears with 6 demo services
6. Select category from dropdown: "Electrician"
7. Enter city: "Hyderabad"
8. Services filter in real-time
9. Click on "Electrical Wiring Installation" service card
10. Select date: Pick any future date
11. Select time: "10:00"
12. Click "Confirm Booking"
13. Should be redirected to /customer-bookings

**Expected Results**:
- ✅ Services load automatically
- ✅ Demo data initializes (console shows messages)
- ✅ Category filter works
- ✅ City filter works
- ✅ Service cards display with ratings
- ✅ Provider name shows on card
- ✅ Date/time picker appears on selection
- ✅ Booking created successfully
- ✅ Booking appears in customer bookings page

**What it tests**: 
- Service display system
- Booking creation
- Demo data initialization
- Filtering system
- Integration between frontend and backend

---

### TEST 5: Customer View Bookings

**Scenario**: Customer sees their bookings
**Steps**:
1. After booking a service (TEST 4)
2. You should be at /customer-bookings
3. See your booking with:
   - Service name
   - Status: "Pending"
   - Date
   - Time
   - Provider ID
4. Click "Cancel Booking" button
5. Confirm cancellation

**Expected Results**:
- ✅ Booking displays with all details
- ✅ Status shows as "Pending"
- ✅ Booking can be cancelled
- ✅ Status changes to "Cancelled"
- ✅ Cancel button disappears

**What it tests**: 
- Booking retrieval
- Booking cancellation
- Real-time status updates

---

### TEST 6: Service Filtering & Search

**Scenario**: Services filter properly by category and city
**Steps**:
1. Go to Book Service page
2. Test Category Dropdown:
   - Select "Plumber" category
   - Observe: Only plumbing services show
   - Select "All Categories"
   - Observe: All services show
3. Test City Filter:
   - Enter "Mumbai"
   - Observe: Only Mumbai services show
   - Clear field
   - Observe: All services show
4. Test Combined Filters:
   - Select "Painter" category
   - Enter "Mumbai"
   - Observe: Only Mumbai painters show

**Expected Results**:
- ✅ Category filter works correctly
- ✅ City filter works correctly
- ✅ Combined filters work
- ✅ Service count updates in real-time
- ✅ "No services found" message appears when applicable

**What it tests**: 
- Frontend filtering logic
- Service data structure
- Real-time reactive updates

---

### TEST 7: Review System

**Scenario**: Customer submits review
**Steps**:
1. Go to /reviews page
2. Services list should appear
3. Select a service
4. Reviews for that service display
5. Enter review details:
   - Rating: 5 stars
   - Comment: "Excellent service!"
6. Submit review
7. Review should appear in list

**Expected Results**:
- ✅ Services load in review page
- ✅ Reviews display for selected service
- ✅ Review form is functional
- ✅ New review appears in list
- ✅ Rating and comments display

**What it tests**: 
- Review submission
- Review display
- Service-review relationship

---

### TEST 8: Admin Dashboard

**Scenario**: Admin manages system
**Steps** (after admin login):
1. Go to /admin-dashboard
2. Click "Providers" in navbar
3. Should see list of all providers
4. Click "Customers" in navbar
5. Should see list of all customers
6. Click "Dashboard" in navbar
7. Should see admin overview

**Expected Results**:
- ✅ Providers list loads
- ✅ Can see provider details
- ✅ Customers list loads
- ✅ Can manage resources
- ✅ Dashboard shows relevant info

**What it tests**: 
- Admin functionality
- Data listing
- Admin dashboard

---

### TEST 9: Provider Dashboard

**Scenario**: Provider manages services
**Steps** (after provider login):
1. Click "Dashboard" in navbar
2. Should see provider profile info
3. Should see list of provider's services
4. Click "Add New Service" button
5. Fill in service details
6. Click "Create Service"
7. New service appears in grid

**Expected Results**:
- ✅ Provider profile displays correctly
- ✅ Services list shows only provider's services
- ✅ Add service form works
- ✅ New service appears immediately
- ✅ Service shows all details
- ✅ Delete button works

**What it tests**: 
- Provider dashboard functionality
- Service management
- Real-time updates

---

### TEST 10: Customer Profile Update

**Scenario**: Customer updates profile
**Steps**:
1. Login as customer
2. Click "Profile" in navbar
3. Click "Update Profile"
4. Change name: "Jane Doe"
5. Change phone: "9999999998"
6. Click "Update"

**Expected Results**:
- ✅ Profile form loads with current data
- ✅ Changes save successfully
- ✅ Navbar shows updated name
- ✅ LocalStorage updates

**What it tests**: 
- Customer update functionality
- Data persistence

---

## 🔧 API ENDPOINT TESTING

### Using Postman or cURL

#### Test 1: Get All Services
```bash
curl http://localhost:8080/api/services
```
**Expected**: Array of service objects with provider and category details

#### Test 2: Create Service
```bash
curl -X POST http://localhost:8080/api/services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Service",
    "description": "Test desc",
    "category": {"id": 1},
    "provider": {"id": 1},
    "price": 500.0,
    "city": "Hyderabad",
    "state": "Telangana",
    "pincode": 500001,
    "isActive": true
  }'
```
**Expected**: Created service object with ID

#### Test 3: Create Booking
```bash
curl -X POST http://localhost:8080/booking/create \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {"id": 1},
    "provider": {"id": 1},
    "service": {"id": 1},
    "serviceName": "Service",
    "bookingDate": "2024-12-25",
    "bookingTime": "10:00:00",
    "status": "Pending"
  }'
```
**Expected**: Created booking object with ID

#### Test 4: Get Customer Bookings
```bash
curl http://localhost:8080/booking/customer/1
```
**Expected**: Array of bookings for customer

#### Test 5: Customer Login
```bash
curl -X POST http://localhost:8080/api/customer/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@customer.com", "password": "password"}'
```
**Expected**: 
```json
{
  "success": true,
  "message": "Login successful",
  "customer": {
    "id": 1,
    "name": "Test User",
    "email": "test@customer.com",
    ...
  }
}
```

#### Test 6: Initialize Demo Data
```bash
curl -X POST http://localhost:8080/api/init/demo-data
```
**Expected**: 
```json
{
  "success": true,
  "message": "Demo data initialized successfully",
  "services_created": 6,
  "providers_created": 3,
  "categories_created": 4
}
```

---

## 📋 VERIFICATION CHECKLIST

### Backend Functionality
- [ ] All endpoints respond correctly
- [ ] Database tables created automatically
- [ ] CORS headers present in responses
- [ ] Error messages are informative
- [ ] Data relationships are correct

### Frontend Functionality
- [ ] All pages load without errors
- [ ] Navigation between pages works
- [ ] Form submissions work
- [ ] Filters work in real-time
- [ ] Buttons trigger correct actions

### Integration
- [ ] Frontend communicates with backend
- [ ] Data persists in database
- [ ] Error messages display properly
- [ ] Loading states show correctly
- [ ] Navigation works after actions

### Data Flow
- [ ] Admin can create/manage resources
- [ ] Customer can book services
- [ ] Provider can create services
- [ ] Services display with all details
- [ ] Bookings track status correctly

### Performance
- [ ] Pages load within 2 seconds
- [ ] No console errors (except warnings)
- [ ] Network requests complete successfully
- [ ] Demo data initializes within 5 seconds
- [ ] No memory leaks in browser

---

## ⚠️ COMMON ISSUES & SOLUTIONS

### Issue: "Cannot find module" on npm run dev
**Solution**: 
```bash
cd frontend
npm install
npm run dev
```

### Issue: "Port 8080 is already in use"
**Solution**: 
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8080
kill -9 <PID>
```

### Issue: "Database connection error"
**Solution**:
1. Ensure MySQL is running
2. Check credentials in application.properties
3. Create database: `mysql -u root -p12345 -e "CREATE DATABASE servicespot;"`

### Issue: "Services not displaying in Book Service"
**Solution**:
1. Check browser console for errors
2. Verify backend is running
3. Wait 10 seconds for auto-initialization
4. Check network tab to see API responses

### Issue: "CORS error" in browser console
**Solution**:
1. Ensure backend is running
2. Check all controllers have @CrossOrigin
3. Clear browser cache
4. Use different browser

### Issue: "Login fails"
**Solution**:
1. Verify credentials are correct
2. Check database has user
3. Try signup instead
4. Check backend logs for errors

---

## 🎯 SUCCESS CRITERIA

All tests pass when:
- ✅ Admin can login and access dashboard
- ✅ Customer can signup, login, and book services
- ✅ Provider can signup and create services
- ✅ Services display with filtering
- ✅ Bookings are created and tracked
- ✅ Reviews can be submitted
- ✅ All pages navigate correctly
- ✅ No console errors
- ✅ All API endpoints respond properly
- ✅ Data persists in database

---

## 📊 TEST REPORT TEMPLATE

```
Date: __________
Tester: __________
Environment: Windows/Linux/Mac

Test 1 - Admin Login: PASS / FAIL
Test 2 - Customer Signup & Login: PASS / FAIL
Test 3 - Provider Signup: PASS / FAIL
Test 4 - Book Service: PASS / FAIL
Test 5 - View Bookings: PASS / FAIL
Test 6 - Service Filtering: PASS / FAIL
Test 7 - Reviews: PASS / FAIL
Test 8 - Admin Dashboard: PASS / FAIL
Test 9 - Provider Dashboard: PASS / FAIL
Test 10 - Profile Update: PASS / FAIL

Issues Found:
1. _______________
2. _______________

Notes:
_______________
```

---

**Happy Testing! 🧪**

If all tests pass, your Service Spot application is fully functional and ready for use!
