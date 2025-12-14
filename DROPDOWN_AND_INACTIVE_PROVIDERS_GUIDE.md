# Service Dropdown & Inactive Providers Feature Guide

## Overview
The BookService page has been enhanced with intelligent filtering to show active and inactive service providers separately. Users can now:
1. Search services by **category dropdown**
2. Search by **service name** (with user input)
3. Filter by **city**
4. See **verified/active providers** prominently
5. View **inactive providers** separately with visual distinction

## Features Implemented

### 1. **Multi-Field Search**
**Category Dropdown**
- Dropdown list populated from database
- Shows all available service categories
- Can be combined with other filters

**Service Name Input**
- Free text input field
- Real-time filtering as user types
- Case-insensitive search
- Matches service names and descriptions

**City Filter**
- Find services in specific cities
- Works with both active and inactive providers
- Case-insensitive matching

### 2. **Active Service Providers Section**
**Displays:**
- Services with verified/active providers
- Shows "✓ Verified" badge for verified providers
- Sorted by verified status and rating
- All services can be booked
- "Book Now" button is enabled

**Visual Indicators:**
- Green verified badge
- Clear, prominent display
- Priority listing (shown first)

### 3. **Inactive Service Providers Section**
**Displays:**
- Services with inactive or unverified providers
- Shows "⚠ Inactive" badge
- Listed separately below active providers
- Users can view details but cannot book
- "Provider Inactive" button (disabled)

**Visual Indicators:**
- Orange/yellow background
- "⚠ Inactive" badge
- Grayed out booking button
- Clear visual separation

### 4. **Smart Separation Logic**
```javascript
// Services are automatically separated by provider status:
Active Providers: provider.verified === true
Inactive Providers: provider.verified === false
```

## Backend Endpoints

### New API Endpoints

1. **Get Services by Category**
   ```
   GET /api/services/by-category?categoryId=1&city=Hyderabad
   ```
   Returns all services in a category for a city, sorted by verified status

2. **Search Services by Name**
   ```
   GET /api/services/search-by-name?name=electrical&city=Hyderabad
   ```
   Returns services matching the name, sorted by verified status

3. **Get Services by City**
   ```
   GET /api/services/location/{city}/all
   ```
   Returns all services in a city

### Query Database
All queries automatically:
- Sort verified providers first
- Include rating in secondary sort
- Return both active and inactive providers
- Use case-insensitive matching

## Frontend Components

### Search Container (book-search-container)
```jsx
<div className="book-search-container">
  <div className="book-search">
    <select>Category Dropdown</select>
    <input>Service Name Input</input>
    <input>City Filter</input>
  </div>
</div>
```

### Active Services Grid
- Shows services with verified providers
- Full width "Book Now" buttons
- Verified badge on each card

### Inactive Services Section
- Separate visual area below active services
- Yellow/orange themed
- Information header explaining status
- Disabled "Provider Inactive" buttons

## User Interface

### Service Cards Layout

**Active Service Card:**
```
┌─────────────────────────────┐
│ Service Name  [Category] ✓V │ (Green verified badge)
│ Description...              │
│ 📍 City, State    ₹Price    │
│ ⭐ Rating (Reviews)          │
│ [Provider Avatar]           │
│ Provider Name              │
│ 📱 Phone                    │
│ 📧 Email                    │
│ [Book Now Button] ────────  │ (Blue, enabled)
└─────────────────────────────┘
```

**Inactive Service Card:**
```
┌─────────────────────────────┐
│ Service Name  [Category] ⚠  │ (Orange inactive badge)
│ Description...              │
│ 📍 City, State    ₹Price    │
│ ⭐ Rating (Reviews)          │
│ [Provider Avatar]           │
│ Provider Name              │
│ 📱 Phone                    │
│ 📧 Email                    │
│ [Provider Inactive] ────────│ (Gray, disabled)
└─────────────────────────────┘
```

## Setup Instructions

### 1. Backend Setup
```bash
cd c:\Users\Admin\Desktop\service-spot\backend
mvn spring-boot:run
```
✓ Backend running on `http://localhost:8080`

### 2. Frontend Setup
```bash
cd c:\Users\Admin\Desktop\service-spot\frontend
npm run dev
```
✓ Frontend running on `http://localhost:5173`

### 3. Database Verification
Ensure providers have `verified` field set:
```sql
SELECT id, name, verified FROM provider LIMIT 5;
```

Expected output:
```
| id | name              | verified |
|----|-------------------|----------|
| 1  | Raj Services      | true     |
| 2  | John Plumbing     | false    |
| 3  | ElectroTech       | true     |
| 4  | Maintenance Co    | false    |
```

## Testing Steps

### Test 1: Load BookService Page
1. Navigate to `http://localhost:5173/book-service`
2. **Expected:**
   - Category dropdown loads with all categories
   - Service name input field appears
   - City input field appears
   - Services display below filters

### Test 2: Filter by Category
1. Select a category from dropdown (e.g., "Electrical")
2. **Expected:**
   - Services filtered to selected category
   - Active services shown first
   - Inactive services (if any) shown below

### Test 3: Search by Service Name
1. Type in "Service Name" field (e.g., "plumb")
2. **Expected:**
   - Real-time filtering as you type
   - Services matching the name appear
   - Case-insensitive search works

### Test 4: Filter by City
1. Enter a city name (e.g., "Hyderabad")
2. **Expected:**
   - Services filtered to that city
   - Active and inactive providers both appear

### Test 5: Combine Filters
1. Select category: "Electrical"
2. Service name: "Repair"
3. City: "Hyderabad"
4. **Expected:**
   - All filters applied together
   - Only matching services shown
   - Active providers listed first

### Test 6: Verify Active Services Section
1. Look at "Active Service Providers (X)" section
2. **Expected:**
   - Shows count of active services
   - Green "✓ Verified" badge visible
   - "Book Now" buttons are blue and enabled
   - Click "Book Now" → Booking form appears

### Test 7: Verify Inactive Services Section
1. Scroll down to "📋 Inactive Service Providers" section
2. **Expected:**
   - Shows only inactive services
   - Orange "⚠ Inactive" badge visible
   - Yellow/orange themed background
   - Message: "These providers are currently inactive..."
   - "Provider Inactive" button is gray and disabled
   - Button tooltip: "This provider is inactive"

### Test 8: Inactive Service Details
1. Click on an inactive service card
2. **Expected:**
   - Card highlights (selected state)
   - Booking form might show but button remains disabled
   - Can view provider contact info
   - Cannot proceed with booking

## CSS Classes Reference

### Search Input Classes
- `.book-search-container` - Outer container
- `.book-search` - Flex row for inputs
- `.category-dropdown` - Category select
- `.service-name-input` - Service name input
- `.city-input` - City input
- `.search-error-message` - Error display

### Badge Classes
- `.verified-badge` - Green badge for verified providers
- `.inactive-badge` - Orange badge for inactive providers

### Service Card Classes
- `.service-card` - Standard service card
- `.inactive-service-card` - Inactive service styling
- `.inactive-service-card.selected` - Selected inactive card

### Section Classes
- `.inactive-services-section` - Inactive section wrapper
- `.inactive-header` - Header with explanation
- `.inactive-note` - Description text

### Button Classes
- `.book-now-btn` - Standard booking button (enabled)
- `.inactive-book-btn` - Disabled button for inactive

## Data Structure

### Service Object (from API)
```json
{
  "id": 1,
  "name": "Electrical Repair",
  "description": "Professional electrical repair services",
  "price": 500.0,
  "city": "Hyderabad",
  "state": "Telangana",
  "pincode": 500012,
  "rating": 4.5,
  "reviewCount": 12,
  "isActive": true,
  "category": {
    "id": 3,
    "name": "Electrical",
    "description": "Electrical Services"
  },
  "provider": {
    "id": 5,
    "name": "Raj Services",
    "email": "raj@services.com",
    "phone": "9876543210",
    "city": "Hyderabad",
    "verified": true,
    "profileImage": "data:image/jpeg;base64,..."
  }
}
```

### Filtering Logic
```javascript
// Get all services
const allServices = await fetch('/api/services');

// Separate by provider verification status
const activeServices = allServices.filter(s => s.provider?.verified === true);
const inactiveServices = allServices.filter(s => s.provider?.verified === false);

// Apply additional filters (category, city, name)
// Then re-separate active/inactive
```

## Browser Console Debugging

### Console Messages When Loading
```
Starting to load services...
Demo data initialized
Categories fetched
Services fetched
All services API response: [...]
Services count: 15
Service 0: {id: 1, name: "...", provider: {id: 5, name: "...", verified: true}}
Service 1: {id: 2, name: "...", provider: {id: 6, name: "...", verified: false}}
...
```

### Check Active/Inactive Split
Open console and run:
```javascript
// Count active services
document.querySelectorAll('.service-card:not(.inactive-service-card)').length

// Count inactive services
document.querySelectorAll('.inactive-service-card').length
```

## Troubleshooting

### No Services Appear
**Check:**
1. Backend is running: `http://localhost:8080/api/services`
2. Database has services: `SELECT COUNT(*) FROM services;`
3. Console for errors (F12 → Console)

**Solution:**
- Restart backend
- Verify database connection
- Check if services table is populated

### Dropdown Shows No Categories
**Check:**
1. Backend endpoint working: `http://localhost:8080/api/category`
2. Database has categories: `SELECT COUNT(*) FROM category;`

**Solution:**
- Add categories to database first
- Create services with category assignments

### Inactive Section Not Showing
**Check:**
1. Database has inactive providers:
   ```sql
   SELECT * FROM provider WHERE verified = false;
   ```
2. Services linked to those providers:
   ```sql
   SELECT s.* FROM services s 
   JOIN provider p ON s.provider_id = p.id 
   WHERE p.verified = false;
   ```

**Solution:**
- Create test data with inactive providers
- Run sample SQL to set some providers as inactive

### Filters Not Working
**Check:**
1. All input fields have correct classes
2. onChange handlers are connected
3. Console shows filter updates

**Solution:**
- Hard refresh browser (Ctrl+Shift+R)
- Clear browser cache
- Check for JavaScript errors in console

## Performance Notes

### Search Performance
- Client-side filtering for speed
- No API call needed for each filter
- All data loaded once on page load

### Optimization Tips
1. **Lazy Load Images**: Provider avatars load only when visible
2. **Debounce Search**: Input debouncing prevents excessive filtering
3. **Memoize Results**: Filtered lists cached while filters unchanged

### Database Queries
- Optimized with EAGER loading
- Indexes on `provider_id`, `category_id`, `city`, `verified`
- Uses LOWER() for case-insensitive matching

## Security Considerations

1. **User Input Sanitization**: All search inputs sanitized
2. **SQL Injection Prevention**: Parameterized queries used
3. **Data Visibility**: Only public provider info shown
4. **Booking Permission**: Verified on backend before creation

## Future Enhancements

1. **Advanced Filters**
   - Price range slider
   - Rating/review filter
   - Distance/location-based

2. **Sorting Options**
   - Sort by price
   - Sort by rating
   - Sort by newest

3. **Favorites/Bookmarks**
   - Save favorite providers
   - Quick access to bookmarks

4. **Provider Reactivation**
   - Admin panel to reactivate providers
   - Status change notifications

5. **Service Categories Autocomplete**
   - Type-ahead suggestions
   - Popular categories first

## Build Status
✓ Backend: `mvn clean compile` - SUCCESS
✓ Frontend: `npm run build` - SUCCESS

## Deployment Checklist
- ✓ Backend endpoints tested
- ✓ Frontend components styled
- ✓ Database queries optimized
- ✓ Error handling implemented
- ✓ User feedback messages added
- ✓ Responsive design verified
- ✓ Browser compatibility checked

Ready for production deployment!
