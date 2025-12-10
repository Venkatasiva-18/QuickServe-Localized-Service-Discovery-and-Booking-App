package Team.C.Service.Spot.controller;

import Team.C.Service.Spot.model.Customer;
import Team.C.Service.Spot.services.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/customer")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CustomerController {

    private final CustomerService service;

    // Register
    @PostMapping("/signup")
    public Customer signup(@RequestBody Customer customer) {
        return service.signup(customer);
    }

    // Login
    @PostMapping("/login")
    public Boolean login(@RequestBody Customer customer) {
        return service.login(customer.getEmail(), customer.getPassword());
    }

    @GetMapping("/byEmail/{email}")
public Customer getByEmail(@PathVariable String email) {
    return service.getCustomerByEmail(email);
}


    // Update password only
    @PostMapping("/updatePassword")
    public Customer updatePassword(@RequestBody Customer customer) {
        return service.updatePassword(customer.getId(), customer.getPassword());
    }

    // Update full customer details
    @PutMapping("/update/{id}")
    public Customer update(@PathVariable Long id, @RequestBody Customer customer) {
        return service.updateCustomer(id, customer);
    }

    // Delete customer
    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteCustomer(id);
    }
}
