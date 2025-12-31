# Real-Time Notification System - QuickServe

## 🔔 Overview
This document describes the implementation of a Facebook-like real-time, persistent notification system for the QuickServe application.

---

## 📋 Table of Contents
1. [Features](#features)
2. [Architecture](#architecture)
3. [Backend Implementation](#backend-implementation)
4. [Frontend Implementation](#frontend-implementation)
5. [API Endpoints](#api-endpoints)
6. [WebSocket Integration](#websocket-integration)
7. [Notification Types](#notification-types)
8. [Usage Examples](#usage-examples)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)

---

## ✨ Features

### Real-Time Features
- ✅ **Instant Notifications**: WebSocket-based real-time delivery
- ✅ **Browser Notifications**: Native browser notification support
- ✅ **Live Badge Counter**: Real-time unread count updates
- ✅ **Auto-Connect**: Automatic WebSocket reconnection on disconnect

### Persistence Features
- ✅ **Database Storage**: All notifications stored in MySQL
- ✅ **Read/Unread Status**: Track notification read status
- ✅ **Notification History**: Access past notifications
- ✅ **Mark as Read**: Individual and bulk mark as read
- ✅ **Delete Notifications**: Remove unwanted notifications

### User Experience
- ✅ **Priority Levels**: HIGH, NORMAL, LOW priority notifications
- ✅ **Categorization**: Filter by type (all, unread)
- ✅ **Action URLs**: Direct navigation to related pages
- ✅ **Timestamp Display**: Relative time (2m ago, 1h ago, etc.)
- ✅ **Visual Indicators**: Icons, colors, and badges

### Multi-Role Support
- ✅ **Admin Notifications**: System-wide announcements
- ✅ **Customer Notifications**: Booking updates, reviews
- ✅ **Provider Notifications**: New bookings, cancellations

---

## 🏗️ Architecture

### Technology Stack

#### Backend
- **Spring Boot 4.0.0** - Application framework
- **WebSocket (STOMP)** - Real-time communication
- **Spring Data JPA** - Database persistence
- **MySQL** - Notification storage
- **Lombok** - Code generation

#### Frontend
- **React 19.2.0** - UI framework
- **@stomp/stompjs** - WebSocket client
- **sockjs-client** - WebSocket fallback
- **React Context API** - State management

### System Flow

```
┌─────────────┐          ┌─────────────┐          ┌─────────────┐
│   Browser   │◄────────►│   Backend   │◄────────►│   Database  │
│  (React)    │ WebSocket│ (Spring)    │   JPA    │   (MySQL)   │
└─────────────┘          └─────────────┘          └─────────────┘
      │                         │
      │                         │
   Context                 Controller
   Provider                 Service Layer
      │                         │
  Components               Repository
```

---

## 🔧 Backend Implementation

### 1. Database Model

**File:** `backend/src/main/java/Team/C/Service/Spot/model/Notification.java`

```java
@Entity
@Table(name = "notifications")
public class Notification {
    private Long id;
    private String recipientEmail;
    private String recipientRole;  // ADMIN, CUSTOMER, SERVICE_PROVIDER
    private String title;
    private String message;
    private String type;           // BOOKING_CREATED, BOOKING_CONFIRMED, etc.
    private Boolean isRead;
    private Long relatedEntityId;
    private String relatedEntityType;
    private String actionUrl;
    private String senderName;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
    private String priority;       // HIGH, NORMAL, LOW
}
```

### 2. Repository Layer

**File:** `backend/src/main/java/Team/C/Service/Spot/repositery/NotificationRepo.java`

Key methods:
- `findByRecipientEmailOrderByCreatedAtDesc()` - Get all notifications
- `findByRecipientEmailAndIsReadFalseOrderByCreatedAtDesc()` - Get unread
- `countByRecipientEmailAndIsReadFalse()` - Count unread
- `markAllAsRead()` - Bulk update
- `deleteOldReadNotifications()` - Cleanup

### 3. Service Layer

**File:** `backend/src/main/java/Team/C/Service/Spot/services/NotificationService.java`

Key features:
- Creates and persists notifications
- Sends real-time notifications via WebSocket
- Helper methods for common notification types
- Cleanup utilities

### 4. WebSocket Configuration

**File:** `backend/src/main/java/Team/C/Service/Spot/config/WebSocketConfig.java`

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    // Endpoint: /ws-notifications
    // User channel: /user/{email}/queue/notifications
}
```

### 5. REST API Controller

**File:** `backend/src/main/java/Team/C/Service/Spot/controller/NotificationController.java`

---

## 🎨 Frontend Implementation

### 1. Notification Context

**File:** `frontend/src/context/NotificationContext.jsx`

Provides:
- WebSocket connection management
- Notification state management
- Real-time notification handling
- Browser notification support
- CRUD operations

### 2. Notification Bell Component

**File:** `frontend/src/components/NotificationBell.jsx`

Features:
- Dropdown notification panel
- Unread badge counter
- Filter (all/unread)
- Mark as read/delete actions
- Time formatting

### 3. Integration with App

**File:** `frontend/src/App.jsx`

```jsx
<NotificationProvider>
  <Navbar />
  <Routes>...</Routes>
</NotificationProvider>
```

**File:** `frontend/src/components/Navbar.jsx`

```jsx
{loggedIn && <NotificationBell />}
```

---

## 📡 API Endpoints

### Base URL: `http://localhost:8080/api/notifications`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create notification |
| GET | `/user/{email}` | Get all notifications |
| GET | `/user/{email}/unread` | Get unread notifications |
| GET | `/user/{email}/unread/count` | Get unread count |
| GET | `/user/{email}/recent?days=7` | Get recent notifications |
| PUT | `/{id}/read` | Mark as read |
| PUT | `/user/{email}/read-all` | Mark all as read |
| DELETE | `/{id}` | Delete notification |
| DELETE | `/cleanup?daysOld=30` | Cleanup old notifications |

### Example API Calls

#### Create Notification
```javascript
POST /api/notifications
Content-Type: application/json

{
  "recipientEmail": "customer@example.com",
  "recipientRole": "CUSTOMER",
  "title": "Booking Confirmed",
  "message": "Your booking has been confirmed",
  "type": "BOOKING_CONFIRMED",
  "relatedEntityId": 123,
  "relatedEntityType": "BOOKING",
  "actionUrl": "/customer-bookings",
  "senderName": "John Provider",
  "priority": "HIGH"
}
```

#### Get Unread Count
```javascript
GET /api/notifications/user/customer@example.com/unread/count

Response:
{
  "count": 5
}
```

---

## 🔌 WebSocket Integration

### Connection
**Endpoint:** `ws://localhost:8080/ws-notifications`

### Subscribe to Notifications
```javascript
stompClient.subscribe(
  `/user/${userEmail}/queue/notifications`,
  (message) => {
    const notification = JSON.parse(message.body);
    // Handle notification
  }
);
```

### Message Format
```json
{
  "id": 1,
  "title": "New Booking",
  "message": "You have a new booking request",
  "type": "BOOKING_CREATED",
  "isRead": false,
  "priority": "HIGH",
  "createdAt": "2025-12-28T18:30:00",
  "actionUrl": "/provider-bookings"
}
```

---

## 📬 Notification Types

### Booking Notifications

| Type | Recipient | Trigger | Priority |
|------|-----------|---------|----------|
| `BOOKING_CREATED` | Provider | Customer creates booking | HIGH |
| `BOOKING_CONFIRMED` | Customer | Provider confirms | HIGH |
| `BOOKING_CANCELLED` | Both | Either cancels | HIGH |
| `BOOKING_COMPLETED` | Customer | Provider marks complete | NORMAL |

### Review Notifications

| Type | Recipient | Trigger | Priority |
|------|-----------|---------|----------|
| `REVIEW_RECEIVED` | Provider | Customer leaves review | NORMAL |

### Helper Methods in NotificationService

```java
// Provider gets notified of new booking
notificationService.notifyBookingCreated(
  providerEmail, customerName, bookingId, serviceName
);

// Customer gets notified of confirmation
notificationService.notifyBookingConfirmed(
  customerEmail, providerName, bookingId, serviceName
);

// Notify about cancellation
notificationService.notifyBookingCancelled(
  recipientEmail, role, senderName, bookingId, serviceName
);

// Notify about completion
notificationService.notifyBookingCompleted(
  customerEmail, providerName, bookingId, serviceName
);

// Notify about review
notificationService.notifyReviewReceived(
  providerEmail, customerName, reviewId, rating
);
```

---

## 💡 Usage Examples

### 1. Integrate in Booking Creation

**In BookingController.java:**
```java
@PostMapping("/create")
public ResponseEntity<?> createBooking(@RequestBody BookingDTO dto) {
    Booking booking = bookingService.createBooking(dto);
    
    // Send notification
    notificationService.notifyBookingCreated(
        provider.getEmail(),
        customer.getName(),
        booking.getId(),
        service.getName()
    );
    
    return ResponseEntity.ok(booking);
}
```

### 2. Use in React Component

```jsx
import { useNotifications } from '../context/NotificationContext';

function MyComponent() {
    const { 
        notifications, 
        unreadCount, 
        markAsRead 
    } = useNotifications();
    
    return (
        <div>
            <p>You have {unreadCount} unread notifications</p>
            {notifications.map(n => (
                <div onClick={() => markAsRead(n.id)}>
                    {n.title}: {n.message}
                </div>
            ))}
        </div>
    );
}
```

### 3. Request Browser Notification Permission

```jsx
import { useNotifications } from '../context/NotificationContext';

function Settings() {
    const { requestNotificationPermission } = useNotifications();
    
    return (
        <button onClick={requestNotificationPermission}>
            Enable Notifications
        </button>
    );
}
```

---

## 🧪 Testing

### 1. Backend Testing

#### Test Notification Creation
```bash
curl -X POST http://localhost:8080/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "recipientEmail": "admin@servicespot.com",
    "recipientRole": "ADMIN",
    "title": "Test Notification",
    "message": "This is a test",
    "type": "BOOKING_CREATED",
    "priority": "NORMAL"
  }'
```

#### Test Get Notifications
```bash
curl http://localhost:8080/api/notifications/user/admin@servicespot.com
```

#### Test WebSocket Connection
Use browser console:
```javascript
const socket = new SockJS('http://localhost:8080/ws-notifications');
const stompClient = Stomp.over(socket);

stompClient.connect({}, () => {
    console.log('Connected to WebSocket');
    
    stompClient.subscribe('/user/admin@servicespot.com/queue/notifications', 
        (message) => {
            console.log('Received:', message.body);
        }
    );
});
```

### 2. Frontend Testing

1. **Login** as customer or provider
2. **Check** notification bell appears in navbar
3. **Create** a booking (triggers notification to provider)
4. **Verify** notification appears in real-time
5. **Click** on notification (marks as read)
6. **Check** unread count decreases

---

## 🔍 Troubleshooting

### Issue: Notifications not appearing

**Check:**
1. WebSocket connection status (look for console logs)
2. User email is stored in localStorage
3. Backend server is running
4. CORS settings allow frontend origin

**Solution:**
```javascript
// In browser console
localStorage.getItem('customerEmail') // Should return email
```

### Issue: WebSocket connection fails

**Check:**
1. Backend WebSocket endpoint is accessible
2. Port 8080 is not blocked
3. CORS configuration in WebSocketConfig

**Solution:**
Update `WebSocketConfig.java`:
```java
registry.addEndpoint("/ws-notifications")
    .setAllowedOrigins("http://localhost:5173")
    .withSockJS();
```

### Issue: Database errors

**Check:**
1. MySQL is running
2. `notifications` table exists
3. Database permissions

**Solution:**
Run application - JPA will auto-create table

### Issue: Notifications persist but don't show real-time

**Likely cause:** WebSocket not connected

**Solution:**
1. Check browser console for connection errors
2. Verify `NotificationProvider` wraps the app
3. Check that user is logged in

---

## 📦 Installation & Setup

### 1. Backend Setup

#### Add Dependencies (already done)
`pom.xml` includes:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

#### Database Migration
The `notifications` table will be auto-created by JPA on first run.

Manual creation (optional):
```sql
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipient_email VARCHAR(255) NOT NULL,
    recipient_role VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message VARCHAR(1000) NOT NULL,
    type VARCHAR(100) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    related_entity_id BIGINT,
    related_entity_type VARCHAR(50),
    action_url VARCHAR(500),
    sender_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    priority VARCHAR(20) DEFAULT 'NORMAL',
    INDEX idx_recipient_email (recipient_email),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
);
```

### 2. Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install @stomp/stompjs sockjs-client
```

#### Already Updated Files
- ✅ `package.json` - Dependencies added
- ✅ `App.jsx` - NotificationProvider wrapped
- ✅ `Navbar.jsx` - NotificationBell added

---

## 🚀 Quick Start

### Start Backend
```bash
cd backend
./mvnw spring-boot:run
```

### Start Frontend
```bash
cd frontend
npm run dev
```

### Test Notifications

1. **Login** as admin: `admin@servicespot.com` / `admin123`
2. **Open** browser console
3. **Create** a test notification via API or by creating a booking
4. **Watch** notification appear in real-time!

---

## 🎯 Best Practices

1. **Always use helper methods** in NotificationService for common types
2. **Set appropriate priorities** (HIGH for urgent, NORMAL for info)
3. **Include actionUrl** to allow users to navigate
4. **Clean up old notifications** periodically (use cleanup endpoint)
5. **Handle WebSocket disconnections** gracefully (auto-reconnect)
6. **Test with multiple users** to verify role-based delivery

---

## 🔮 Future Enhancements

### Potential Features
- 📧 Email notifications for important events
- 🔕 Notification preferences/settings
- 📊 Notification analytics dashboard
- 🔔 Custom notification sounds
- 📱 Push notifications for mobile
- 🎨 Customizable notification templates
- 🔐 Notification encryption
- 📅 Scheduled notifications
- 👥 Group notifications
- 🌐 Multi-language support

---

## 📞 Support

For issues or questions:
1. Check [Troubleshooting](#troubleshooting) section
2. Review console logs (browser & backend)
3. Verify API endpoints with curl/Postman
4. Check WebSocket connection status

---

## 📄 License

This notification system is part of the QuickServe application.

---

**Last Updated:** December 28, 2025
**Version:** 1.0.0
**Author:** Senior Full Stack Java Developer

