package Team.C.Service.Spot.mapper;

import Team.C.Service.Spot.dto.customer.CustomerRegistrationDTO;
import Team.C.Service.Spot.dto.customer.CustomerResponseDTO;
import Team.C.Service.Spot.dto.customer.CustomerUpdateDTO;
import Team.C.Service.Spot.model.Customer;
import org.springframework.stereotype.Component;

import java.util.Base64;

/**
 * Mapper utility for Customer entity and DTOs
 * Handles all conversions between Customer entity and various DTOs
 * Keeps mapping logic centralized and reusable
 */
@Component
public class CustomerMapper {

    /**
     * Convert CustomerRegistrationDTO to Customer Entity
     * Used during customer registration
     *
     * @param dto CustomerRegistrationDTO
     * @return Customer entity (without ID, createdAt, updatedAt - managed by JPA)
     */
    public Customer registrationDtoToEntity(CustomerRegistrationDTO dto) {
        if (dto == null) {
            return null;
        }

        byte[] profileImageBytes = null;
        if (dto.getProfileImage() != null && !dto.getProfileImage().isEmpty()) {
            try {
                // Remove data:image prefix if present
                String base64Image = dto.getProfileImage();
                if (base64Image.contains(",")) {
                    base64Image = base64Image.split(",")[1];
                }
                profileImageBytes = Base64.getDecoder().decode(base64Image);
            } catch (IllegalArgumentException e) {
                // Invalid base64, leave as null
                profileImageBytes = null;
            }
        }

        return Customer.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                // Password will be set separately (after encoding)
                .phone(dto.getPhone())
                .doorNo(dto.getDoorNo())
                .addressLine(dto.getAddressLine())
                .city(dto.getCity())
                .state(dto.getState())
                .pincode(dto.getPincode())
                .country(dto.getCountry() != null ? dto.getCountry() : "India")
                .latitude(dto.getLatitude() != null ? dto.getLatitude() : 0.0)
                .longitude(dto.getLongitude() != null ? dto.getLongitude() : 0.0)
                .verified(false) // New customers are unverified by default
                .role("CUSTOMER")
                .profileImage(profileImageBytes)
                .build();
    }

    /**
     * Convert Customer Entity to CustomerResponseDTO
     * Used when returning customer data in API responses
     *
     * @param customer Customer entity
     * @return CustomerResponseDTO (without password)
     */
    public CustomerResponseDTO entityToResponseDto(Customer customer) {
        if (customer == null) {
            return null;
        }

        String profileImageBase64 = null;
        if (customer.getProfileImage() != null && customer.getProfileImage().length > 0) {
            profileImageBase64 = "data:image/jpeg;base64," +
                                Base64.getEncoder().encodeToString(customer.getProfileImage());
        }

        return CustomerResponseDTO.builder()
                .id(customer.getId())
                .name(customer.getName())
                .email(customer.getEmail())
                .phone(customer.getPhone())
                .doorNo(customer.getDoorNo())
                .addressLine(customer.getAddressLine())
                .city(customer.getCity())
                .state(customer.getState())
                .pincode(customer.getPincode())
                .country(customer.getCountry())
                .latitude(customer.getLatitude())
                .longitude(customer.getLongitude())
                .verified(customer.getVerified())
                .role(customer.getRole())
                .createdAt(customer.getCreatedAt())
                .updatedAt(customer.getUpdatedAt())
                .profileImage(profileImageBase64)
                .build();
        // Note: Password is NOT included in response DTO
    }

    /**
     * Update Customer Entity from CustomerUpdateDTO
     * Used when customer updates their profile
     * Only updates non-null fields from DTO (partial update)
     *
     * @param customer Existing customer entity
     * @param dto CustomerUpdateDTO with updated fields
     */
    public void updateEntityFromDto(Customer customer, CustomerUpdateDTO dto) {
        if (dto == null || customer == null) {
            return;
        }

        if (dto.getName() != null && !dto.getName().isEmpty()) {
            customer.setName(dto.getName());
        }
        if (dto.getPhone() != null && !dto.getPhone().isEmpty()) {
            customer.setPhone(dto.getPhone());
        }
        if (dto.getDoorNo() != null && !dto.getDoorNo().isEmpty()) {
            customer.setDoorNo(dto.getDoorNo());
        }
        if (dto.getAddressLine() != null && !dto.getAddressLine().isEmpty()) {
            customer.setAddressLine(dto.getAddressLine());
        }
        if (dto.getCity() != null && !dto.getCity().isEmpty()) {
            customer.setCity(dto.getCity());
        }
        if (dto.getState() != null && !dto.getState().isEmpty()) {
            customer.setState(dto.getState());
        }
        if (dto.getPincode() != null) {
            customer.setPincode(dto.getPincode());
        }
        if (dto.getCountry() != null && !dto.getCountry().isEmpty()) {
            customer.setCountry(dto.getCountry());
        }
        if (dto.getLatitude() != null) {
            customer.setLatitude(dto.getLatitude());
        }
        if (dto.getLongitude() != null) {
            customer.setLongitude(dto.getLongitude());
        }
        if (dto.getProfileImage() != null && !dto.getProfileImage().isEmpty()) {
            try {
                // Remove data:image prefix if present
                String base64Image = dto.getProfileImage();
                if (base64Image.contains(",")) {
                    base64Image = base64Image.split(",")[1];
                }
                byte[] profileImageBytes = Base64.getDecoder().decode(base64Image);
                customer.setProfileImage(profileImageBytes);
            } catch (IllegalArgumentException e) {
                // Invalid base64, don't update
            }
        }
        // updatedAt will be automatically updated by @UpdateTimestamp
    }
}

