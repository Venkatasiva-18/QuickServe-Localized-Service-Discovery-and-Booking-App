# Search Results Not Showing - Debugging Guide

## Issue
User navigates to `http://localhost:5173/search?service=painter&area=&city=` but no search results are displayed.

## Recent Fixes Applied
1. ✓ Improved frontend error handling with better logging
2. ✓ Fixed backend SQL query to use COALESCE for NULL handling
3. ✓ Updated URL parameter building to skip empty parameters

## Diagnostic Steps

### Step 1: Check Backend Server Status
Open PowerShell and run:
```powershell
# Test if backend is running
$response = Invoke-WebRequest -Uri "http://localhost:8080/api/provider" -Method Get -ErrorAction SilentlyContinue
if ($response.StatusCode -eq 200) {
    Write-Host "✓ Backend is running" -ForegroundColor Green
} else {
    Write-Host "✗ Backend is not responding" -ForegroundColor Red
}
```

**If not running:**
```bash
cd c:\Users\Admin\Desktop\service-spot\backend
mvn spring-boot:run
```

### Step 2: Check Browser Console
1. Open browser at `http://localhost:5173/search?service=painter&area=&city=`
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. You should see logs like:
   ```
   Fetching from: http://localhost:8080/api/search?service=painter
   Response status: 200
   Received data: [...]
   ```

**If you see errors:**
- **404**: Backend endpoint not found
- **CORS error**: Cross-origin issue
- **Network error**: Backend not running

### Step 3: Test API Directly
Run this PowerShell script to test the backend API:

```powershell
$baseUrl = "http://localhost:8080"

Write-Host "Testing Provider Search..." -ForegroundColor Cyan

# Test 1: Search with service only
Write-Host "`n1. Testing: ?service=painter"
$url = "$baseUrl/api/search?service=painter"
try {
    $response = Invoke-WebRequest -Uri $url -Method Get -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✓ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "  Results: $($data.Count) providers found"
    if ($data.Count -gt 0) {
        Write-Host "  Sample: $($data[0].name) - $($data[0].serviceType)"
    }
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Get all providers
Write-Host "`n2. Testing: GET /api/provider (all providers)"
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/provider" -Method Get -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✓ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "  Total providers in DB: $($data.Count)"
    if ($data.Count -gt 0) {
        Write-Host "  Sample providers:" -ForegroundColor Yellow
        $data | Select-Object -First 3 | ForEach-Object {
            Write-Host "    - $($_.name): $($_.serviceType) in $($_.city)"
        }
    }
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}
```

### Step 4: Check Database
If API returns 0 results, check if there's any provider data:

```powershell
Write-Host "Checking database..." -ForegroundColor Cyan

# Get all providers
$response = Invoke-WebRequest -Uri "http://localhost:8080/api/provider" -Method Get
$providers = $response.Content | ConvertFrom-Json

Write-Host "Total providers: $($providers.Count)" -ForegroundColor Yellow
Write-Host "Service types available:" -ForegroundColor Yellow
$providers | Select-Object -ExpandProperty serviceType | Sort-Object -Unique | ForEach-Object {
    Write-Host "  - $_"
}
```

## Common Issues & Solutions

### Issue 1: No Results, But Backend Running
**Symptom**: API returns empty array `[]`

**Cause**: No providers in database with matching criteria

**Solution**:
- Add test data using Admin Dashboard
- Or use API to add a provider:
```powershell
$provider = @{
    name = "John Painter"
    email = "painter@example.com"
    password = "password123"
    phone = "9876543210"
    doorNo = "101"
    addressLine = "Main Street"
    city = "Hyderabad"
    state = "Telangana"
    pincode = "500001"
    country = "India"
    serviceType = "Painter"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/provider/signup" `
  -Method Post `
  -Body $provider `
  -ContentType "application/json"
```

### Issue 2: No Error Message, Infinite Loading
**Symptom**: Search page shows "Loading providers..." forever

**Cause**: 
- Backend server not running
- CORS configuration issue
- Network connectivity problem

**Solution**:
1. Check browser Network tab (F12)
2. Look for the `/api/search` request
3. Check its status and response body
4. Restart both servers:
```bash
# Terminal 1 - Backend
cd c:\Users\Admin\Desktop\service-spot\backend
mvn spring-boot:run

# Terminal 2 - Frontend
cd c:\Users\Admin\Desktop\service-spot\frontend
npm run dev
```

### Issue 3: CORS Error
**Symptom**: Console shows "CORS policy blocked"

**Solution**: Restart backend server. CORS is configured to allow `http://localhost:5173`

### Issue 4: Wrong Results Showing
**Cause**: Case sensitivity or partial matching issues

**Solution**: Query uses case-insensitive LIKE with partial matching, so:
- "paint" matches "Painter"
- "electri" matches "Electrician"
- Search is case-insensitive

## Query Breakdown

The backend uses this SQL query:
```sql
SELECT p FROM Provider p WHERE 
  (:service IS NULL OR LOWER(COALESCE(p.serviceType, '')) LIKE LOWER(CONCAT('%', :service, '%'))) AND 
  (:area IS NULL OR LOWER(COALESCE(p.addressLine, '')) LIKE LOWER(CONCAT('%', :area, '%'))) AND 
  (:city IS NULL OR LOWER(COALESCE(p.city, '')) LIKE LOWER(CONCAT('%', :city, '%')))
```

**How it works**:
- If `service` is provided → searches in `serviceType` field (case-insensitive, partial match)
- If `service` is NULL/empty → ignores this filter
- Same for `area` and `city`
- Returns providers matching ALL provided criteria

## Updated Components

### Frontend Changes:
- ✓ **SearchResults.jsx** - Added console logging and better error messages
- ✓ **Search.jsx** - Input validation (at least one field required)

### Backend Changes:
- ✓ **ProviderRepo.java** - Fixed query with COALESCE to handle NULLs
- ✓ **SearchController.java** - Converts empty strings to NULL

## Testing the Fix

### Test Case 1: Search with Service Only
```
URL: http://localhost:5173/search?service=painter&area=&city=
Expected: Shows all painters regardless of location
```

### Test Case 2: Search with All Criteria
```
URL: http://localhost:5173/search?service=electrician&area=Jubilee%20Hills&city=Hyderabad
Expected: Shows electricians in Jubilee Hills, Hyderabad
```

### Test Case 3: Search with City Only
```
URL: http://localhost:5173/search?service=&area=&city=Hyderabad
Expected: Shows all providers in Hyderabad
```

## Next Steps

1. **Verify Build**: Both builds successful ✓
2. **Restart Servers**:
   ```bash
   # Backend
   mvn spring-boot:run
   
   # Frontend
   npm run dev
   ```
3. **Test in Browser**:
   - Go to home page
   - Enter "painter" in Service Type
   - Click Search
   - Check console (F12) for logs
4. **Run Diagnostic Script** from this document
5. **Share Console Output** if still not working

## Files Modified

- ✓ `SearchResults.jsx` - Added logging
- ✓ `Search.jsx` - Added validation  
- ✓ `Search.css` - Added error styling
- ✓ `ProviderRepo.java` - Fixed SQL query
- ✓ `SearchController.java` - Parameter validation
