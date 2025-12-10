package Team.C.Service.Spot.services;

import Team.C.Service.Spot.model.Customer;
import Team.C.Service.Spot.repository.CustomerRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepo repo;

    // Register customer
    public Customer signup(Customer customer) {

        // Check if email already exists
        if (repo.findByEmail(customer.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered!");
        }

        return repo.save(customer);
    }

    // Login (email + password)
    public Boolean login(String email, String password) {
        Optional<Customer> customer = repo.findByEmail(email);

        return customer.map(c -> c.getPassword().equals(password)).orElse(false);
    }

    // Update password
    public Customer updatePassword(Long id, String newPassword) {
        return repo.findById(id)
                .map(c -> {
                    c.setPassword(newPassword);
                    return repo.save(c);
                })
                .orElse(null);
    }

    // Update all fields
    public Customer updateCustomer(Long id, Customer updated) {
        return repo.findById(id)
                .map(existing -> {
                    existing.setName(updated.getName());
                    existing.setEmail(updated.getEmail());
                    existing.setPassword(updated.getPassword());
                    existing.setMobile(updated.getMobile());
                    existing.setDoorNo(updated.getDoorNo());
                    existing.setAddressLine(updated.getAddressLine());
                    existing.setCity(updated.getCity());
                    existing.setState(updated.getState());
                    existing.setPincode(updated.getPincode());
                    existing.setCountry(updated.getCountry());
                    existing.setLatitude(updated.getLatitude());
                    existing.setLongitude(updated.getLongitude());
                    return repo.save(existing);
                })
                .orElse(null);
    }

    public Customer getCustomerByEmail(String email) {
    return repo.findByEmail(email).orElse(null);
}


    // Delete customer
    public void deleteCustomer(Long id) {
        repo.deleteById(id);
    }
}
