package Team.C.Service.Spot.services;

import Team.C.Service.Spot.model.Booking;
import Team.C.Service.Spot.repository.Bookingrepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final Bookingrepo repo;

    public List<Booking> getBookingsByCustomerId(Long customerId) {
        return repo.findByCustomerId(customerId);
    }

    public Booking createBooking(Booking booking) {
        booking.setStatus("Pending");
        return repo.save(booking);
    }
}
