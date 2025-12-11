package Team.C.Service.Spot.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import Team.C.Service.Spot.model.Provider;
import Team.C.Service.Spot.repositery.ProviderRepo;

@Service
@RequiredArgsConstructor
public class ProviderService {

    private final ProviderRepo providerRepo;

    public Provider signup(Provider provider) {
        return providerRepo.save(provider);
    }

    public Optional<Provider> login(String email, String password) {
        return providerRepo.findByEmail(email)
                .filter(p -> p.getPassword().equals(password));
    }

    public Optional<Provider> getProviderById(Long id) {
        return providerRepo.findById(id);
    }

    public Optional<Provider> getProviderByEmail(String email) {
        return providerRepo.findByEmail(email);
    }

    public List<Provider> getAllProviders() {
        return providerRepo.findAll();
    }

    public List<Provider> getVerifiedProviders() {
        return providerRepo.findByVerified(true);
    }

    public List<Provider> getUnverifiedProviders() {
        return providerRepo.findByVerified(false);
    }

    public Provider updateProvider(Long id, Provider updatedProvider) {
        return providerRepo.findById(id)
                .map(provider -> {
                    provider.setName(updatedProvider.getName());
                    provider.setEmail(updatedProvider.getEmail());
                    if (updatedProvider.getPassword() != null) {
                        provider.setPassword(updatedProvider.getPassword());
                    }
                    provider.setPhone(updatedProvider.getPhone());
                    provider.setDoorNo(updatedProvider.getDoorNo());
                    provider.setAddressLine(updatedProvider.getAddressLine());
                    provider.setCity(updatedProvider.getCity());
                    provider.setState(updatedProvider.getState());
                    provider.setPincode(updatedProvider.getPincode());
                    provider.setCountry(updatedProvider.getCountry());
                    provider.setServiceType(updatedProvider.getServiceType());
                    provider.setPrice(updatedProvider.getPrice());
                    provider.setLatitude(updatedProvider.getLatitude());
                    provider.setLongitude(updatedProvider.getLongitude());
                    return providerRepo.save(provider);
                })
                .orElse(null);
    }

    public Provider verifyProvider(Long id) {
        return providerRepo.findById(id)
                .map(provider -> {
                    provider.setVerified(true);
                    return providerRepo.save(provider);
                })
                .orElse(null);
    }

    public Provider rejectProvider(Long id) {
        return providerRepo.findById(id)
                .map(provider -> {
                    provider.setVerified(false);
                    return providerRepo.save(provider);
                })
                .orElse(null);
    }

    public void deleteProvider(Long id) {
        providerRepo.deleteById(id);
    }
}
