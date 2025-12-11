package Team.C.Service.Spot.controller;

import Team.C.Service.Spot.model.Booking;
import Team.C.Service.Spot.services.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/booking")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {
    
    private final BookingService bookingService;
    
    private Object convertToDTO(Booking booking) {
        if (booking == null) return null;
        
        return new HashMap<String, Object>() {{
            put("id", booking.getId());
            put("serviceName", booking.getServiceName());
            put("date", booking.getBookingDate());
            put("time", booking.getBookingTime());
            put("status", booking.getStatus());
            put("notes", booking.getNotes());
            put("createdAt", booking.getCreatedAt());
            put("completedAt", booking.getCompletedAt());
            put("cancelledAt", booking.getCancelledAt());
            put("customerId", booking.getCustomer() != null ? booking.getCustomer().getId() : null);
            put("customerName", booking.getCustomer() != null ? booking.getCustomer().getName() : null);
            put("providerId", booking.getProvider() != null ? booking.getProvider().getId() : null);
            put("providerName", booking.getProvider() != null ? booking.getProvider().getName() : null);
            put("serviceId", booking.getService() != null ? booking.getService().getId() : null);
        }};
    }
    
    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        try {
            if (booking.getCustomer() == null || booking.getCustomer().getId() == null) {
                return ResponseEntity.badRequest().body("Customer ID is required");
            }
            if (booking.getProvider() == null || booking.getProvider().getId() == null) {
                return ResponseEntity.badRequest().body("Provider ID is required");
            }
            if (booking.getService() == null || booking.getService().getId() == null) {
                return ResponseEntity.badRequest().body("Service ID is required");
            }
            if (booking.getBookingDate() == null) {
                return ResponseEntity.badRequest().body("Booking date is required");
            }
            if (booking.getBookingTime() == null) {
                return ResponseEntity.badRequest().body("Booking time is required");
            }
            
            Booking created = bookingService.createBooking(booking);
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(created));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getBooking(@PathVariable Long id) {
        return bookingService.getBookingById(id)
                .map(booking -> ResponseEntity.ok(convertToDTO(booking)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<?>> getCustomerBookings(@PathVariable Long customerId) {
        List<?> bookings = bookingService.getCustomerBookings(customerId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<?>> getProviderBookings(@PathVariable Long providerId) {
        List<?> bookings = bookingService.getProviderBookings(providerId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<?>> getServiceBookings(@PathVariable Long serviceId) {
        List<?> bookings = bookingService.getServiceBookings(serviceId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<?>> getBookingsByStatus(@PathVariable String status) {
        List<?> bookings = bookingService.getBookingsByStatus(status)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping
    public ResponseEntity<List<?>> getAllBookings() {
        List<?> bookings = bookingService.getAllBookings()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bookings);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBooking(@PathVariable Long id, @RequestBody Booking booking) {
        Booking updated = bookingService.updateBooking(id, booking);
        if (updated != null) {
            return ResponseEntity.ok(convertToDTO(updated));
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/cancel/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        Booking cancelled = bookingService.cancelBooking(id);
        if (cancelled != null) {
            return ResponseEntity.ok(convertToDTO(cancelled));
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/complete/{id}")
    public ResponseEntity<?> completeBooking(@PathVariable Long id) {
        Booking completed = bookingService.completeBooking(id);
        if (completed != null) {
            return ResponseEntity.ok(convertToDTO(completed));
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable Long id) {
        if (bookingService.deleteBooking(id)) {
            return ResponseEntity.ok("Booking deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }
}
