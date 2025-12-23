package Team.C.Service.Spot.services;

import org.springframework.stereotype.Service;
import Team.C.Service.Spot.model.ProviderLocation;
import Team.C.Service.Spot.repositery.ProviderLocationRepository;

@Service
public class ProviderLocationService {

    private final ProviderLocationRepository repository;

    public ProviderLocationService(ProviderLocationRepository repository) {
        this.repository = repository;
    }

    // Provider app sends live location
    public ProviderLocation updateLocation(Long providerId, double latitude, double longitude) {

        ProviderLocation location =
                repository.findByProviderId(providerId)
                        .orElse(new ProviderLocation());

        location.setProviderId(providerId);
        location.setLatitude(latitude);
        location.setLongitude(longitude);
        location.setUpdatedAt(System.currentTimeMillis());

        return repository.save(location);
    }

    // Customer fetches provider live location
    public ProviderLocation getLocation(Long providerId) {
        return repository.findByProviderId(providerId).orElse(null);
    }
}
