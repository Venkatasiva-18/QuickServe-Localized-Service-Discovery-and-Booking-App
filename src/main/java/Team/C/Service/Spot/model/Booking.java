package Team.C.Service.Spot.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "booking")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Customer ID from localStorage
    private Long customerId;

    // Provider ID selected by user
    private Long providerId;

    // Name of service (Electrician, Plumbing etc.)
    private String serviceName;

    // Selected Date
    private String date;

    // Selected Time
    private String time;

    // Booking status: Pending, Accepted, Rejected, Completed, Cancelled
    private String status = "Pending";
}
