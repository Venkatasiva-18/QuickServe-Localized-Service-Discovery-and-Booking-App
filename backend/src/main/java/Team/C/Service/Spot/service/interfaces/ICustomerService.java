package Team.C.Service.Spot.service.interfaces;

import Team.C.Service.Spot.dto.customer.CustomerLoginDTO;
import Team.C.Service.Spot.dto.customer.CustomerRegistrationDTO;
import Team.C.Service.Spot.dto.customer.CustomerResponseDTO;
import Team.C.Service.Spot.dto.customer.CustomerUpdateDTO;
import Team.C.Service.Spot.exception.DuplicateEmailException;
import Team.C.Service.Spot.exception.DuplicatePhoneException;
import Team.C.Service.Spot.exception.InvalidCredentialsException;

import java.util.List;

/**
 * Service Interface for Customer Operations
 * Defines the contract for customer-related business logic
 */
public interface ICustomerService {

    /**
     * Register a new customer
     *
     * @param registrationDTO Customer registration data
     * @return CustomerResponseDTO with created customer data (without password)
     * @throws DuplicateEmailException if email already exists
     * @throws DuplicatePhoneException if phone already exists
     */
    CustomerResponseDTO registerCustomer(CustomerRegistrationDTO registrationDTO);

    /**
     * Authenticate customer login
     *
     * @param loginDTO Customer login credentials
     * @return CustomerResponseDTO if authentication successful
     * @throws InvalidCredentialsException if credentials are invalid
     */
    CustomerResponseDTO loginCustomer(CustomerLoginDTO loginDTO);

    /**
     * Get customer by ID
     *
     * @param id Customer ID
     * @return CustomerResponseDTO
     * @throws ResourceNotFoundException if customer not found
     */
    CustomerResponseDTO getCustomerById(Long id);

    /**
     * Get customer by email
     *
     * @param email Customer email
     * @return CustomerResponseDTO
     * @throws ResourceNotFoundException if customer not found
     */
    CustomerResponseDTO getCustomerByEmail(String email);

    /**
     * Get all customers
     *
     * @return List of CustomerResponseDTO
     */
    List<CustomerResponseDTO> getAllCustomers();

    /**
     * Update customer profile
     *
     * @param id Customer ID
     * @param updateDTO Updated customer data
     * @return CustomerResponseDTO with updated data
     * @throws ResourceNotFoundException if customer not found
     * @throws DuplicatePhoneException if phone already exists
     */
    CustomerResponseDTO updateCustomer(Long id, CustomerUpdateDTO updateDTO);

    /**
     * Delete customer
     *
     * @param id Customer ID
     * @throws ResourceNotFoundException if customer not found
     */
    void deleteCustomer(Long id);

    /**
     * Change customer password
     *
     * @param id Customer ID
     * @param currentPassword Current password for verification
     * @param newPassword New password
     * @throws ResourceNotFoundException if customer not found
     * @throws InvalidCredentialsException if current password is wrong
     */
    void changePassword(Long id, String currentPassword, String newPassword);

    /**
     * Verify customer account
     *
     * @param id Customer ID
     * @return CustomerResponseDTO with updated verified status
     * @throws ResourceNotFoundException if customer not found
     */
    CustomerResponseDTO verifyCustomer(Long id);
}

