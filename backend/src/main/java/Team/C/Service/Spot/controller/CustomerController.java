package Team.C.Service.Spot.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import Team.C.Service.Spot.dto.CustomerDTO;
import Team.C.Service.Spot.model.Customer;
import Team.C.Service.Spot.services.CustomerService;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerController {

    private final CustomerService customerService;

    private CustomerDTO mapToDTO(Customer customer) {
        return CustomerDTO.builder()
                .id(customer.getId())
                .name(customer.getName())
                .email(customer.getEmail())
                .phone(customer.getPhone())
                .doorNo(customer.getDoorNo())
                .addressLine(customer.getAddressLine())
                .city(customer.getCity())
                .state(customer.getState())
                .pincode(customer.getPincode() != null ? customer.getPincode().toString() : "0")
                .country(customer.getCountry())
                .latitude(customer.getLatitude())
                .longitude(customer.getLongitude())
                .verified(customer.getVerified())
                .build();
    }

    private Customer mapToEntity(CustomerDTO dto) {
        Integer pincode = 0;
        if (dto.getPincode() != null && !dto.getPincode().isEmpty()) {
            try {
                pincode = Integer.parseInt(dto.getPincode());
            } catch (NumberFormatException e) {
                pincode = 0;
            }
        }
        
        Double latitude = dto.getLatitude() != null ? dto.getLatitude() : 0.0;
        Double longitude = dto.getLongitude() != null ? dto.getLongitude() : 0.0;
        
        return Customer.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .doorNo(dto.getDoorNo())
                .addressLine(dto.getAddressLine())
                .city(dto.getCity())
                .state(dto.getState())
                .pincode(pincode)
                .country(dto.getCountry())
                .latitude(latitude)
                .longitude(longitude)
                .verified(dto.getVerified() != null ? dto.getVerified() : false)
                .password(dto.getPassword())
                .role("CUSTOMER")
                .build();
    }

    @PostMapping(value = "/signup", consumes = {"application/json"}, produces = {"application/json"})
    public ResponseEntity<?> signup(@RequestBody CustomerDTO dto) {
        try {
            Customer customer = mapToEntity(dto);
            Customer saved = customerService.signup(customer);
            return ResponseEntity.status(HttpStatus.CREATED).body(mapToDTO(saved));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PostMapping(value = "/login", consumes = {"application/json"}, produces = {"application/json"})
    public ResponseEntity<?> login(@RequestBody CustomerDTO dto) {
        var customer = customerService.getCustomerByEmail(dto.getEmail());
        if (customer.isPresent() && customer.get().getPassword().equals(dto.getPassword())) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("customer", mapToDTO(customer.get()));
            return ResponseEntity.ok(response);
        }
        Map<String, String> error = new HashMap<>();
        error.put("success", "false");
        error.put("message", "Invalid credentials");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @GetMapping
    public ResponseEntity<List<CustomerDTO>> getAllCustomers() {
        List<Customer> customers = customerService.getAllCustomers();
        List<CustomerDTO> dtos = customers.stream().map(this::mapToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomerById(@PathVariable Long id) {
        return customerService.getCustomerById(id)
                .map(customer -> ResponseEntity.ok(mapToDTO(customer)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<?> getCustomerByEmail(@PathVariable String email) {
        return customerService.getCustomerByEmail(email)
                .map(customer -> ResponseEntity.ok(mapToDTO(customer)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable Long id, @RequestBody CustomerDTO dto) {
        try {
            Customer customer = mapToEntity(dto);
            Customer updated = customerService.updateCustomer(id, customer);
            if (updated != null) {
                return ResponseEntity.ok(mapToDTO(updated));
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getClass().getSimpleName());
            error.put("message", e.getMessage());
            error.put("details", e.toString());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/{id}/update-password")
    public ResponseEntity<?> updatePassword(@PathVariable Long id, @RequestBody CustomerDTO dto) {
        Customer updated = customerService.updatePassword(id, dto.getPassword());
        if (updated != null) {
            return ResponseEntity.ok(mapToDTO(updated));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok("Customer deleted successfully");
    }
}
