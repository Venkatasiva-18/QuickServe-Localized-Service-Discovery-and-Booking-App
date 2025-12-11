package Team.C.Service.Spot.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import Team.C.Service.Spot.dto.ProviderDTO;
import Team.C.Service.Spot.model.Provider;
import Team.C.Service.Spot.services.ProviderService;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/provider")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ProviderController {

    private final ProviderService providerService;

    private ProviderDTO mapToDTO(Provider provider) {
        return ProviderDTO.builder()
                .id(provider.getId())
                .name(provider.getName())
                .email(provider.getEmail())
                .phone(provider.getPhone())
                .doorNo(provider.getDoorNo())
                .addressLine(provider.getAddressLine())
                .city(provider.getCity())
                .state(provider.getState())
                .pincode(provider.getPincode())
                .country(provider.getCountry())
                .serviceType(provider.getServiceType())
                .price(provider.getPrice())
                .latitude(provider.getLatitude())
                .longitude(provider.getLongitude())
                .verified(provider.getVerified())
                .build();
    }

    private Provider mapToEntity(ProviderDTO dto) {
        Double latitude = dto.getLatitude() != null ? dto.getLatitude() : null;
        Double longitude = dto.getLongitude() != null ? dto.getLongitude() : null;
        return Provider.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .phone(dto.getPhone())
                .doorNo(dto.getDoorNo())
                .addressLine(dto.getAddressLine())
                .city(dto.getCity())
                .state(dto.getState())
                .pincode(dto.getPincode())
                .country(dto.getCountry())
                .serviceType(dto.getServiceType())
                .price(dto.getPrice() != null ? dto.getPrice() : 0.0f)
                .latitude(latitude)
                .longitude(longitude)
                .verified(dto.getVerified() != null ? dto.getVerified() : false)
                .role("PROVIDER")
                .build();
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody ProviderDTO dto) {
        try {
            if (dto.getName() == null || dto.getName().isEmpty()) {
                return ResponseEntity.badRequest().body("Name is required");
            }
            if (dto.getEmail() == null || dto.getEmail().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            if (dto.getPassword() == null || dto.getPassword().isEmpty()) {
                return ResponseEntity.badRequest().body("Password is required");
            }
            if (dto.getPhone() == null || dto.getPhone().isEmpty()) {
                return ResponseEntity.badRequest().body("Phone is required");
            }
            if (dto.getDoorNo() == null || dto.getDoorNo().isEmpty()) {
                return ResponseEntity.badRequest().body("Door number is required");
            }
            if (dto.getAddressLine() == null || dto.getAddressLine().isEmpty()) {
                return ResponseEntity.badRequest().body("Address is required");
            }
            if (dto.getCity() == null || dto.getCity().isEmpty()) {
                return ResponseEntity.badRequest().body("City is required");
            }
            if (dto.getState() == null || dto.getState().isEmpty()) {
                return ResponseEntity.badRequest().body("State is required");
            }
            if (dto.getPincode() == null) {
                return ResponseEntity.badRequest().body("Pincode is required");
            }
            if (dto.getServiceType() == null || dto.getServiceType().isEmpty()) {
                return ResponseEntity.badRequest().body("Service type is required");
            }
            
            Provider provider = mapToEntity(dto);
            Provider savedProvider = providerService.signup(provider);
            return ResponseEntity.status(HttpStatus.CREATED).body(mapToDTO(savedProvider));
        } catch (Exception e) {
            java.util.Map<String, Object> error = new java.util.HashMap<>();
            error.put("error", e.getClass().getSimpleName());
            error.put("message", e.getMessage());
            error.put("details", e.toString());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody ProviderDTO dto) {
        var result = providerService.login(dto.getEmail(), dto.getPassword());
        if (result.isPresent()) {
            return ResponseEntity.ok(mapToDTO(result.get()));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProviderById(@PathVariable Long id) {
        return providerService.getProviderById(id)
                .map(provider -> ResponseEntity.ok(mapToDTO(provider)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<?> getProviderByEmail(@PathVariable String email) {
        return providerService.getProviderByEmail(email)
                .map(provider -> ResponseEntity.ok(mapToDTO(provider)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<ProviderDTO>> getAllProviders() {
        List<Provider> providers = providerService.getAllProviders();
        List<ProviderDTO> dtos = providers.stream().map(this::mapToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/verified/all")
    public ResponseEntity<List<ProviderDTO>> getVerifiedProviders() {
        List<Provider> providers = providerService.getVerifiedProviders();
        List<ProviderDTO> dtos = providers.stream().map(this::mapToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/unverified/all")
    public ResponseEntity<List<ProviderDTO>> getUnverifiedProviders() {
        List<Provider> providers = providerService.getUnverifiedProviders();
        List<ProviderDTO> dtos = providers.stream().map(this::mapToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProvider(@PathVariable Long id, @RequestBody ProviderDTO dto) {
        try {
            Provider provider = mapToEntity(dto);
            Provider updated = providerService.updateProvider(id, provider);
            if (updated != null) {
                return ResponseEntity.ok(mapToDTO(updated));
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            java.util.Map<String, Object> error = new java.util.HashMap<>();
            error.put("error", e.getClass().getSimpleName());
            error.put("message", e.getMessage());
            error.put("details", e.toString());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping("/{id}/verify")
    public ResponseEntity<?> verifyProvider(@PathVariable Long id) {
        Provider verified = providerService.verifyProvider(id);
        if (verified != null) {
            return ResponseEntity.ok(mapToDTO(verified));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectProvider(@PathVariable Long id) {
        Provider rejected = providerService.rejectProvider(id);
        if (rejected != null) {
            return ResponseEntity.ok(mapToDTO(rejected));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProvider(@PathVariable Long id) {
        providerService.deleteProvider(id);
        return ResponseEntity.ok("Provider deleted successfully");
    }
}
