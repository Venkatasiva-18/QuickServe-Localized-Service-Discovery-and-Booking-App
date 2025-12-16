package Team.C.Service.Spot.service.impl;

import Team.C.Service.Spot.dto.customer.CustomerLoginDTO;
import Team.C.Service.Spot.dto.customer.CustomerRegistrationDTO;
import Team.C.Service.Spot.dto.customer.CustomerResponseDTO;
import Team.C.Service.Spot.dto.customer.CustomerUpdateDTO;
import Team.C.Service.Spot.exception.DuplicateEmailException;
import Team.C.Service.Spot.exception.DuplicatePhoneException;
import Team.C.Service.Spot.exception.InvalidCredentialsException;
import Team.C.Service.Spot.exception.ResourceNotFoundException;
import Team.C.Service.Spot.mapper.CustomerMapper;
import Team.C.Service.Spot.model.Customer;
import Team.C.Service.Spot.repositery.CustomerRepo;
import Team.C.Service.Spot.service.interfaces.ICustomerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Customer Service Implementation
 * Implements all customer-related business logic
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CustomerServiceImpl implements ICustomerService {

    private final CustomerRepo customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomerMapper customerMapper;

    @Override
    public CustomerResponseDTO registerCustomer(CustomerRegistrationDTO registrationDTO) {
        log.info("Registering new customer with email: {}", registrationDTO.getEmail());

        // Check if email already exists
        if (customerRepository.findByEmail(registrationDTO.getEmail()).isPresent()) {
            log.error("Registration failed: Email already exists - {}", registrationDTO.getEmail());
            throw new DuplicateEmailException(registrationDTO.getEmail());
        }

        // Check if phone already exists
        if (customerRepository.findByPhone(registrationDTO.getPhone()).isPresent()) {
            log.error("Registration failed: Phone already exists - {}", registrationDTO.getPhone());
            throw new DuplicatePhoneException(registrationDTO.getPhone());
        }

        // Map DTO to Entity
        Customer customer = customerMapper.registrationDtoToEntity(registrationDTO);

        // Hash password using BCrypt
        String encodedPassword = passwordEncoder.encode(registrationDTO.getPassword());
        customer.setPassword(encodedPassword);

        // Save customer
        Customer savedCustomer = customerRepository.save(customer);
        log.info("Customer registered successfully with ID: {}", savedCustomer.getId());

        // Map to Response DTO and return (no password!)
        return customerMapper.entityToResponseDto(savedCustomer);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponseDTO loginCustomer(CustomerLoginDTO loginDTO) {
        log.info("Login attempt for email: {}", loginDTO.getEmail());

        // Find customer by email
        Customer customer = customerRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> {
                    log.error("Login failed: Customer not found - {}", loginDTO.getEmail());
                    return new InvalidCredentialsException();
                });

        // Verify password using BCrypt
        if (!passwordEncoder.matches(loginDTO.getPassword(), customer.getPassword())) {
            log.error("Login failed: Invalid password for email - {}", loginDTO.getEmail());
            throw new InvalidCredentialsException();
        }

        log.info("Customer logged in successfully: {}", customer.getId());

        // Return customer data (no password!)
        return customerMapper.entityToResponseDto(customer);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponseDTO getCustomerById(Long id) {
        log.info("Fetching customer by ID: {}", id);
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", id));
        return customerMapper.entityToResponseDto(customer);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponseDTO getCustomerByEmail(String email) {
        log.info("Fetching customer by email: {}", email);
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "email", email));
        return customerMapper.entityToResponseDto(customer);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomerResponseDTO> getAllCustomers() {
        log.info("Fetching all customers");
        return customerRepository.findAll()
                .stream()
                .map(customerMapper::entityToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public CustomerResponseDTO updateCustomer(Long id, CustomerUpdateDTO updateDTO) {
        log.info("Updating customer with ID: {}", id);

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", id));

        // Check if phone is being updated and if it's already in use by another customer
        if (updateDTO.getPhone() != null && !updateDTO.getPhone().equals(customer.getPhone())) {
            customerRepository.findByPhone(updateDTO.getPhone())
                    .ifPresent(existingCustomer -> {
                        if (!existingCustomer.getId().equals(id)) {
                            throw new DuplicatePhoneException(updateDTO.getPhone());
                        }
                    });
        }

        // Update customer fields
        customerMapper.updateEntityFromDto(customer, updateDTO);

        // Save updated customer
        Customer updatedCustomer = customerRepository.save(customer);
        log.info("Customer updated successfully: {}", id);

        return customerMapper.entityToResponseDto(updatedCustomer);
    }

    @Override
    public void deleteCustomer(Long id) {
        log.info("Deleting customer with ID: {}", id);

        if (!customerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Customer", "id", id);
        }

        customerRepository.deleteById(id);
        log.info("Customer deleted successfully: {}", id);
    }

    @Override
    public void changePassword(Long id, String currentPassword, String newPassword) {
        log.info("Changing password for customer ID: {}", id);

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", id));

        // Verify current password
        if (!passwordEncoder.matches(currentPassword, customer.getPassword())) {
            log.error("Password change failed: Current password incorrect for customer ID: {}", id);
            throw new InvalidCredentialsException("Current password is incorrect");
        }

        // Hash and set new password
        String encodedNewPassword = passwordEncoder.encode(newPassword);
        customer.setPassword(encodedNewPassword);

        customerRepository.save(customer);
        log.info("Password changed successfully for customer ID: {}", id);
    }

    @Override
    public CustomerResponseDTO verifyCustomer(Long id) {
        log.info("Verifying customer with ID: {}", id);

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", id));

        customer.setVerified(true);
        Customer verifiedCustomer = customerRepository.save(customer);

        log.info("Customer verified successfully: {}", id);
        return customerMapper.entityToResponseDto(verifiedCustomer);
    }
}

