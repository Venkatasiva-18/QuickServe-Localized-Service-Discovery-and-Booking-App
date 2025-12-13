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
                    if (updatedProvider.getName() != null) {
                        provider.setName(updatedProvider.getName());
                    }
                    if (updatedProvider.getEmail() != null) {
                        provider.setEmail(updatedProvider.getEmail());
                    }
                    if (updatedProvider.getPassword() != null) {
                        provider.setPassword(updatedProvider.getPassword());
                    }
                    if (updatedProvider.getPhone() != null) {
                        provider.setPhone(updatedProvider.getPhone());
                    }
                    if (updatedProvider.getDoorNo() != null) {
                        provider.setDoorNo(updatedProvider.getDoorNo());
                    }
                    if (updatedProvider.getAddressLine() != null) {
                        provider.setAddressLine(updatedProvider.getAddressLine());
                    }
                    if (updatedProvider.getCity() != null) {
                        provider.setCity(updatedProvider.getCity());
                    }
                    if (updatedProvider.getState() != null) {
                        provider.setState(updatedProvider.getState());
                    }
                    if (updatedProvider.getPincode() != null) {
                        provider.setPincode(updatedProvider.getPincode());
                    }
                    if (updatedProvider.getCountry() != null) {
                        provider.setCountry(updatedProvider.getCountry());
                    }
                    if (updatedProvider.getServiceType() != null) {
                        provider.setServiceType(updatedProvider.getServiceType());
                    }
                    if (updatedProvider.getPrice() != null) {
                        provider.setPrice(updatedProvider.getPrice());
                    }
                    if (updatedProvider.getLatitude() != null) {
                        provider.setLatitude(updatedProvider.getLatitude());
                    }
                    if (updatedProvider.getLongitude() != null) {
                        provider.setLongitude(updatedProvider.getLongitude());
                    }
                    if (updatedProvider.getProfileImage() != null) {
                        provider.setProfileImage(updatedProvider.getProfileImage());
                    }
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

    public List<Provider> searchProviders(String service, String area, String city) {
        return providerRepo.searchProviders(service, area, city);
    }

    public List<Provider> findByCity(String city) {
        return providerRepo.findByCity(city);
    }

    public List<Provider> findByServiceType(String serviceType) {
        return providerRepo.findByServiceType(serviceType);
    }

    public List<Provider> findByServiceTypeAndCity(String serviceType, String city) {
        return providerRepo.findByServiceTypeAndCity(serviceType, city);
    }

    public List<String> getDistinctCities() {
        return providerRepo.findDistinctCities();
    }

    public List<String> getDistinctServiceTypes() {
        return providerRepo.findDistinctServiceTypes();
    }

    public List<String> getDistinctAreasByCity(String city) {
        return providerRepo.findDistinctAreasByCity(city);
    }
}
