package Team.C.Service.Spot.controller;

import Team.C.Service.Spot.model.Booking;
import Team.C.Service.Spot.services.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/booking")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    private final BookingService bookingService;

    // Get all bookings of a customer
    @GetMapping("/customer/{customerId}")
    public List<Booking> getBookings(@PathVariable Long customerId) {
        return bookingService.getBookingsByCustomerId(customerId);
    }

    // Create a new booking
    @PostMapping("/create")
    public Booking create(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }
}
