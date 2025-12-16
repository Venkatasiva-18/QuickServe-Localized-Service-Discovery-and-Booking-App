package Team.C.Service.Spot.mapper;

import Team.C.Service.Spot.dto.provider.ProviderRegistrationDTO;
import Team.C.Service.Spot.dto.provider.ProviderResponseDTO;
import Team.C.Service.Spot.dto.provider.ProviderUpdateDTO;
import Team.C.Service.Spot.model.Provider;
import org.springframework.stereotype.Component;

import java.util.Base64;

/**
 * Mapper utility for Provider entity and DTOs
 * Handles all conversions between Provider entity and various DTOs
 * Keeps mapping logic centralized and reusable
 */
@Component
public class ProviderMapper {

    /**
     * Convert ProviderRegistrationDTO to Provider Entity
     * Used during provider registration
     *
     * @param dto ProviderRegistrationDTO
     * @return Provider entity (without ID, createdAt, updatedAt - managed by JPA)
     */
    public Provider registrationDtoToEntity(ProviderRegistrationDTO dto) {
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

        return Provider.builder()
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
                .serviceType(dto.getServiceType())
                .price(dto.getPrice() != null ? dto.getPrice() : 0.0f)
                .latitude(dto.getLatitude() != null ? dto.getLatitude() : 0.0)
                .longitude(dto.getLongitude() != null ? dto.getLongitude() : 0.0)
                .verified(false) // New providers are unverified by default
                .role("PROVIDER")
                .profileImage(profileImageBytes)
                .build();
    }

    /**
     * Convert Provider Entity to ProviderResponseDTO
     * Used when returning provider data in API responses
     *
     * @param provider Provider entity
     * @return ProviderResponseDTO (without password)
     */
    public ProviderResponseDTO entityToResponseDto(Provider provider) {
        if (provider == null) {
            return null;
        }

        String profileImageBase64 = null;
        if (provider.getProfileImage() != null && provider.getProfileImage().length > 0) {
            profileImageBase64 = "data:image/jpeg;base64," +
                                Base64.getEncoder().encodeToString(provider.getProfileImage());
        }

        return ProviderResponseDTO.builder()
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
                .role(provider.getRole())
                .createdAt(provider.getCreatedAt())
                .updatedAt(provider.getUpdatedAt())
                .profileImage(profileImageBase64)
                .build();
    }

    /**
     * Update existing Provider entity from ProviderUpdateDTO
     * Only updates non-null fields (partial update)
     *
     * @param provider Existing provider entity to update
     * @param dto ProviderUpdateDTO with updated fields
     * @return Updated provider entity
     */
    public Provider updateEntityFromDto(Provider provider, ProviderUpdateDTO dto) {
        if (provider == null || dto == null) {
            return provider;
        }

        // Update only non-null fields
        if (dto.getName() != null) {
            provider.setName(dto.getName());
        }
        if (dto.getPhone() != null) {
            provider.setPhone(dto.getPhone());
        }
        if (dto.getDoorNo() != null) {
            provider.setDoorNo(dto.getDoorNo());
        }
        if (dto.getAddressLine() != null) {
            provider.setAddressLine(dto.getAddressLine());
        }
        if (dto.getCity() != null) {
            provider.setCity(dto.getCity());
        }
        if (dto.getState() != null) {
            provider.setState(dto.getState());
        }
        if (dto.getPincode() != null) {
            provider.setPincode(dto.getPincode());
        }
        if (dto.getCountry() != null) {
            provider.setCountry(dto.getCountry());
        }
        if (dto.getServiceType() != null) {
            provider.setServiceType(dto.getServiceType());
        }
        if (dto.getPrice() != null) {
            provider.setPrice(dto.getPrice());
        }
        if (dto.getLatitude() != null) {
            provider.setLatitude(dto.getLatitude());
        }
        if (dto.getLongitude() != null) {
            provider.setLongitude(dto.getLongitude());
        }
        if (dto.getProfileImage() != null && !dto.getProfileImage().isEmpty()) {
            try {
                String base64Image = dto.getProfileImage();
                if (base64Image.contains(",")) {
                    base64Image = base64Image.split(",")[1];
                }
                byte[] profileImageBytes = Base64.getDecoder().decode(base64Image);
                provider.setProfileImage(profileImageBytes);
            } catch (IllegalArgumentException e) {
                // Invalid base64, keep existing image
            }
        }

        return provider;
    }
}

