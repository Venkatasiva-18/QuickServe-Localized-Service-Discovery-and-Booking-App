package Team.C.Service.Spot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import Team.C.Service.Spot.model.Customer;
import java.util.Optional;

public interface CustomerRepo extends JpaRepository<Customer, Long> {
    Optional<Customer> findByEmail(String email);
}
