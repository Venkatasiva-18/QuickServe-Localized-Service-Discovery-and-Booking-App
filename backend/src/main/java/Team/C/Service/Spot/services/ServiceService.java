package Team.C.Service.Spot.services;

import Team.C.Service.Spot.model.Service;
import Team.C.Service.Spot.repositery.ServiceRepo;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ServiceService {
    
    private final ServiceRepo serviceRepo;
    
    public List<Service> getAllServices() {
        return serviceRepo.findAll();
    }
    
    public Optional<Service> getServiceById(Long id) {
        return serviceRepo.findById(id);
    }
    
    public List<Service> getServicesByProviderId(Long providerId) {
        return serviceRepo.findByProviderId(providerId);
    }
    
    public List<Service> getServicesByCategory(Long categoryId) {
        return serviceRepo.findByCategoryId(categoryId);
    }
    
    public List<Service> searchServices(String keyword, String city) {
        return serviceRepo.searchByNameAndLocation(keyword, city);
    }
    
    public List<Service> getServicesByLocation(String city, String state) {
        return serviceRepo.findByLocationOrderByRating(city, state);
    }
    
    public List<Service> getServicesByLocationAndCategory(String city, String state, Long categoryId) {
        return serviceRepo.findByLocationAndCategory(city, state, categoryId);
    }
    
    public Service createService(Service service) {
        return serviceRepo.save(service);
    }
    
    public Service updateService(Long id, Service updatedService) {
        return serviceRepo.findById(id)
                .map(service -> {
                    service.setName(updatedService.getName());
                    service.setDescription(updatedService.getDescription());
                    service.setCategory(updatedService.getCategory());
                    service.setPrice(updatedService.getPrice());
                    service.setCity(updatedService.getCity());
                    service.setState(updatedService.getState());
                    service.setPincode(updatedService.getPincode());
                    service.setIsActive(updatedService.getIsActive());
                    service.setUpdatedAt(new java.util.Date());
                    return serviceRepo.save(service);
                })
                .orElse(null);
    }
    
    public void updateServiceRating(Long serviceId, Double rating, Integer reviewCount) {
        serviceRepo.findById(serviceId)
                .ifPresent(service -> {
                    service.setRating(rating);
                    service.setReviewCount(reviewCount);
                    service.setUpdatedAt(new java.util.Date());
                    serviceRepo.save(service);
                });
    }
    
    public boolean deleteService(Long id) {
        if (serviceRepo.existsById(id)) {
            serviceRepo.deleteById(id);
            return true;
        }
        return false;
    }
}
