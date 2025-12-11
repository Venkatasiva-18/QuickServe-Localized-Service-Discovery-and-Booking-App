package Team.C.Service.Spot.controller;

import Team.C.Service.Spot.model.Category;
import Team.C.Service.Spot.model.Provider;
import Team.C.Service.Spot.model.Service;
import Team.C.Service.Spot.services.CategoryService;
import Team.C.Service.Spot.services.ProviderService;
import Team.C.Service.Spot.services.ServiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/init")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class DataInitController {
    
    private final CategoryService categoryService;
    private final ProviderService providerService;
    private final ServiceService serviceService;
    
    @PostMapping("/demo-data")
    public ResponseEntity<?> initializeDemoData() {
        try {
            // Create Categories
            Category electrician = categoryService.createCategory(
                    Category.builder()
                            .name("Electrician")
                            .description("Electrical services")
                            .build()
            );
            
            Category plumber = categoryService.createCategory(
                    Category.builder()
                            .name("Plumber")
                            .description("Plumbing services")
                            .build()
            );
            
            Category painter = categoryService.createCategory(
                    Category.builder()
                            .name("Painter")
                            .description("Painting services")
                            .build()
            );
            
            Category cleaner = categoryService.createCategory(
                    Category.builder()
                            .name("Home Cleaning")
                            .description("Home cleaning services")
                            .build()
            );
            
            // Create Providers
            Provider provider1 = Provider.builder()
                    .name("Raj Kumar")
                    .email("raj@example.com")
                    .password("password123")
                    .phone("9999999991")
                    .doorNo("123")
                    .addressLine("Main Street")
                    .city("Hyderabad")
                    .state("Telangana")
                    .pincode(500001)
                    .country("India")
                    .serviceType("Electrician")
                    .price(500.0f)
                    .verified(true)
                    .build();
            
            Provider provider2 = Provider.builder()
                    .name("Arjun Singh")
                    .email("arjun@example.com")
                    .password("password123")
                    .phone("9999999992")
                    .doorNo("456")
                    .addressLine("Second Lane")
                    .city("Hyderabad")
                    .state("Telangana")
                    .pincode(500002)
                    .country("India")
                    .serviceType("Plumber")
                    .price(400.0f)
                    .verified(true)
                    .build();
            
            Provider provider3 = Provider.builder()
                    .name("Vikram Patel")
                    .email("vikram@example.com")
                    .password("password123")
                    .phone("9999999993")
                    .doorNo("789")
                    .addressLine("Third Road")
                    .city("Mumbai")
                    .state("Maharashtra")
                    .pincode(400001)
                    .country("India")
                    .serviceType("Painter")
                    .price(300.0f)
                    .verified(true)
                    .build();
            
            provider1 = providerService.signup(provider1);
            provider2 = providerService.signup(provider2);
            provider3 = providerService.signup(provider3);
            
            // Create Services
            Service service1 = Service.builder()
                    .name("Electrical Wiring Installation")
                    .description("Professional electrical wiring installation for homes and offices")
                    .category(electrician)
                    .provider(provider1)
                    .price(500.0f)
                    .city("Hyderabad")
                    .state("Telangana")
                    .pincode(500001)
                    .rating(4.5)
                    .reviewCount(25)
                    .isActive(true)
                    .build();
            
            Service service2 = Service.builder()
                    .name("Pipe Leakage Repair")
                    .description("Fix all types of pipe leakage issues quickly and efficiently")
                    .category(plumber)
                    .provider(provider2)
                    .price(400.0f)
                    .city("Hyderabad")
                    .state("Telangana")
                    .pincode(500002)
                    .rating(4.8)
                    .reviewCount(32)
                    .isActive(true)
                    .build();
            
            Service service3 = Service.builder()
                    .name("House Painting")
                    .description("Complete house painting with premium quality paints")
                    .category(painter)
                    .provider(provider3)
                    .price(300.0f)
                    .city("Mumbai")
                    .state("Maharashtra")
                    .pincode(400001)
                    .rating(4.6)
                    .reviewCount(18)
                    .isActive(true)
                    .build();
            
            Service service4 = Service.builder()
                    .name("Circuit Breaker Replacement")
                    .description("Safe and reliable circuit breaker replacement service")
                    .category(electrician)
                    .provider(provider1)
                    .price(600.0f)
                    .city("Hyderabad")
                    .state("Telangana")
                    .pincode(500001)
                    .rating(4.9)
                    .reviewCount(42)
                    .isActive(true)
                    .build();
            
            Service service5 = Service.builder()
                    .name("Bathroom Renovation")
                    .description("Complete bathroom renovation with modern fixtures")
                    .category(plumber)
                    .provider(provider2)
                    .price(5000.0f)
                    .city("Hyderabad")
                    .state("Telangana")
                    .pincode(500002)
                    .rating(4.7)
                    .reviewCount(15)
                    .isActive(true)
                    .build();
            
            Service service6 = Service.builder()
                    .name("Home Cleaning Service")
                    .description("Professional deep cleaning for your home")
                    .category(cleaner)
                    .provider(provider3)
                    .price(800.0f)
                    .city("Mumbai")
                    .state("Maharashtra")
                    .pincode(400001)
                    .rating(4.4)
                    .reviewCount(28)
                    .isActive(true)
                    .build();
            
            serviceService.createService(service1);
            serviceService.createService(service2);
            serviceService.createService(service3);
            serviceService.createService(service4);
            serviceService.createService(service5);
            serviceService.createService(service6);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Demo data initialized successfully");
            response.put("services_created", 6);
            response.put("providers_created", 3);
            response.put("categories_created", 4);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
