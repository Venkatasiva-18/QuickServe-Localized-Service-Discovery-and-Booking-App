package Team.C.Service.Spot.services;

import org.springframework.stereotype.Service;
import Team.C.Service.Spot.model.Customer;
import Team.C.Service.Spot.repositery.CustomerRepo;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepo customerRepo;

    public Customer signup(Customer customer) {
        return customerRepo.save(customer);
    }

    public Boolean login(String email, String password) {
        return customerRepo.findByEmail(email)
                .map(c -> c.getPassword().equals(password))
                .orElse(false);
    }

    public List<Customer> getAllCustomers() {
        return customerRepo.findAll();
    }

    public Optional<Customer> getCustomerById(Long id) {
        return customerRepo.findById(id);
    }

    public Optional<Customer> getCustomerByEmail(String email) {
        return customerRepo.findByEmail(email);
    }

    public Customer updateCustomer(Long id, Customer updatedCustomer) {
        return customerRepo.findById(id)
                .map(existing -> {
                    existing.setName(updatedCustomer.getName());
                    existing.setEmail(updatedCustomer.getEmail());
                    if (updatedCustomer.getPassword() != null) {
                        existing.setPassword(updatedCustomer.getPassword());
                    }
                    existing.setPhone(updatedCustomer.getPhone());
                    existing.setDoorNo(updatedCustomer.getDoorNo());
                    existing.setAddressLine(updatedCustomer.getAddressLine());
                    existing.setCity(updatedCustomer.getCity());
                    existing.setState(updatedCustomer.getState());
                    existing.setPincode(updatedCustomer.getPincode());
                    existing.setCountry(updatedCustomer.getCountry());
                    existing.setLatitude(updatedCustomer.getLatitude());
                    existing.setLongitude(updatedCustomer.getLongitude());
                    existing.setVerified(updatedCustomer.getVerified());
                    return customerRepo.save(existing);
                })
                .orElse(null);
    }

    public Customer updatePassword(Long id, String newPassword) {
        return customerRepo.findById(id)
                .map(c -> {
                    c.setPassword(newPassword);
                    return customerRepo.save(c);
                })
                .orElse(null);
    }

    public void deleteCustomer(Long id) {
        customerRepo.deleteById(id);
    }
}
