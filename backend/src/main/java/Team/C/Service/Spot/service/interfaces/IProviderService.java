package Team.C.Service.Spot.service.interfaces;

import Team.C.Service.Spot.dto.provider.ProviderLoginDTO;
import Team.C.Service.Spot.dto.provider.ProviderRegistrationDTO;
import Team.C.Service.Spot.dto.provider.ProviderResponseDTO;
import Team.C.Service.Spot.dto.provider.ProviderUpdateDTO;
import Team.C.Service.Spot.exception.DuplicateEmailException;
import Team.C.Service.Spot.exception.DuplicatePhoneException;
import Team.C.Service.Spot.exception.InvalidCredentialsException;
import Team.C.Service.Spot.exception.ResourceNotFoundException;

import java.util.List;

/**
 * Service Interface for Provider Operations
 * Defines the contract for provider-related business logic
 */
public interface IProviderService {

    /**
     * Register a new provider
     *
     * @param registrationDTO Provider registration data
     * @return ProviderResponseDTO with created provider data (without password)
     * @throws DuplicateEmailException if email already exists
     * @throws DuplicatePhoneException if phone already exists
     */
    ProviderResponseDTO registerProvider(ProviderRegistrationDTO registrationDTO);

    /**
     * Authenticate provider login
     *
     * @param loginDTO Provider login credentials
     * @return ProviderResponseDTO if authentication successful
     * @throws InvalidCredentialsException if credentials are invalid
     */
    ProviderResponseDTO loginProvider(ProviderLoginDTO loginDTO);

    /**
     * Get provider by ID
     *
     * @param id Provider ID
     * @return ProviderResponseDTO
     * @throws ResourceNotFoundException if provider not found
     */
    ProviderResponseDTO getProviderById(Long id);

    /**
     * Get provider by email
     *
     * @param email Provider email
     * @return ProviderResponseDTO
     * @throws ResourceNotFoundException if provider not found
     */
    ProviderResponseDTO getProviderByEmail(String email);

    /**
     * Get all providers
     *
     * @return List of ProviderResponseDTO
     */
    List<ProviderResponseDTO> getAllProviders();

    /**
     * Get all verified providers
     *
     * @return List of ProviderResponseDTO
     */
    List<ProviderResponseDTO> getVerifiedProviders();

    /**
     * Get providers by city
     *
     * @param city City name
     * @return List of ProviderResponseDTO
     */
    List<ProviderResponseDTO> getProvidersByCity(String city);

    /**
     * Get providers by service type
     *
     * @param serviceType Service type
     * @return List of ProviderResponseDTO
     */
    List<ProviderResponseDTO> getProvidersByServiceType(String serviceType);

    /**
     * Update provider profile
     *
     * @param id Provider ID
     * @param updateDTO ProviderUpdateDTO with updated fields
     * @return Updated ProviderResponseDTO
     * @throws ResourceNotFoundException if provider not found
     * @throws DuplicatePhoneException if phone already exists (when phone is being changed)
     */
    ProviderResponseDTO updateProvider(Long id, ProviderUpdateDTO updateDTO);

    /**
     * Delete provider by ID
     *
     * @param id Provider ID
     * @throws ResourceNotFoundException if provider not found
     */
    void deleteProvider(Long id);

    /**
     * Change provider password
     *
     * @param id Provider ID
     * @param currentPassword Current password
     * @param newPassword New password
     * @throws ResourceNotFoundException if provider not found
     * @throws InvalidCredentialsException if current password is incorrect
     */
    void changePassword(Long id, String currentPassword, String newPassword);

    /**
     * Verify provider account (admin action)
     *
     * @param id Provider ID
     * @throws ResourceNotFoundException if provider not found
     */
    void verifyProvider(Long id);

    /**
     * Unverify provider account (admin action)
     *
     * @param id Provider ID
     * @throws ResourceNotFoundException if provider not found
     */
    void unverifyProvider(Long id);
}

