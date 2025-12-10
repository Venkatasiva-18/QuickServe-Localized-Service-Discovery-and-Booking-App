package Team.C.Service.Spot.repository;

import Team.C.Service.Spot.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Bookingrepo extends JpaRepository<Booking, Long> {

    List<Booking> findByCustomerId(Long customerId);

}
