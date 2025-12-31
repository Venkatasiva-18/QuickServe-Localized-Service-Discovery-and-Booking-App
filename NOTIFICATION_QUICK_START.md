# QuickServe Notification System - Quick Start Guide

## 🚀 Quick Start

### Prerequisites
- ✅ Backend compilation successful
- ✅ Frontend dependencies installed
- ✅ MySQL database running

### Step 1: Start the Backend
```bash
cd backend
./mvnw spring-boot:run
```

Wait for the message:
```
Default admin initialized: admin@servicespot.com / admin123
```

### Step 2: Start the Frontend
```bash
cd frontend
npm run dev
```

### Step 3: Test the Notification System

#### Option A: Login and Create a Booking
1. Open browser: `http://localhost:5173`
2. Login as Customer:
   - Register or use existing customer account
3. Navigate to "Book Service"
4. Create a booking
5. **Result**: Provider receives real-time notification!

#### Option B: Test with API
```bash
# Create a test notification
curl -X POST http://localhost:8080/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "recipientEmail": "admin@servicespot.com",
    "recipientRole": "ADMIN",
    "title": "Welcome!",
    "message": "Notification system is working!",
    "type": "BOOKING_CREATED",
    "priority": "HIGH"
  }'
```

### Step 4: View Notifications
1. Look at the top-right corner of the navbar
2. Click the 🔔 bell icon
3. See your notifications!

---

## 🔍 What to Look For

### Visual Indicators
- **Red badge** on bell icon = unread notifications
- **Blue background** = unread notification
- **Border color** = priority (red=HIGH, blue=NORMAL, gray=LOW)

### Real-Time Features
- Notifications appear **instantly** without refresh
- **Badge counter** updates automatically
- **Browser notification** (if permission granted)

---

## 📝 Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend loads successfully
- [ ] Notification bell appears in navbar (when logged in)
- [ ] Can create notifications via API
- [ ] Notifications appear in real-time
- [ ] Can mark notifications as read
- [ ] Can delete notifications
- [ ] Unread count updates correctly
- [ ] WebSocket connection established (check browser console)

---

## 🐛 Troubleshooting

### "Notification bell not showing"
- **Solution**: Make sure you're logged in
- Check: `localStorage.getItem('loggedIn')` should be `"true"`

### "Notifications not appearing in real-time"
- **Check**: Browser console for WebSocket errors
- **Solution**: Verify backend is running on port 8080
- **Check**: Network tab shows WebSocket connection to `/ws-notifications`

### "Cannot create notifications"
- **Check**: Backend logs for errors
- **Solution**: Verify MySQL is running
- **Check**: Table `notifications` exists in database

---

## 📊 Database Table

The `notifications` table will be auto-created by JPA. Verify:

```sql
USE service_spot_db;
SELECT * FROM notifications;
```

---

## 🎯 Integration Points

### Where Notifications are Sent

1. **Booking Created** → Notifies Provider
   - File: `BookingController.java`
   - Method: `createBooking()`

2. **Booking Confirmed** → Notifies Customer
   - File: `BookingController.java`
   - Method: `updateBooking()` (when status → Confirmed)

3. **Booking Cancelled** → Notifies both parties
   - File: `BookingController.java`
   - Method: `cancelBooking()`

4. **Booking Completed** → Notifies Customer
   - File: `BookingController.java`
   - Method: `completeBooking()`

---

## 📚 Next Steps

1. **Enable Browser Notifications**
   - Click notification bell
   - Browser will prompt for permission
   - Click "Allow"

2. **Test Booking Flow**
   - Customer creates booking → Provider gets notified
   - Provider confirms → Customer gets notified
   - Provider completes → Customer gets notified

3. **Customize Notifications**
   - Edit `NotificationService.java` helper methods
   - Add new notification types as needed

---

## 💡 Tips

- Keep browser console open to see WebSocket messages
- Use "Network" tab to debug WebSocket connection
- Check backend logs for notification creation
- Test with multiple browser windows (different users)

---

**Ready to test?** Start the servers and create your first booking! 🎉

