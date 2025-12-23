package Team.C.Service.Spot.repositery;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import Team.C.Service.Spot.model.ProviderLocation;

public interface ProviderLocationRepository
        extends JpaRepository<ProviderLocation, Long> {

    Optional<ProviderLocation> findByProviderId(Long providerId);
}
