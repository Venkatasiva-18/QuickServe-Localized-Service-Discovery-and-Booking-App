package Team.C.Service.Spot.service.impl;

import Team.C.Service.Spot.dto.provider.ProviderLoginDTO;
import Team.C.Service.Spot.dto.provider.ProviderRegistrationDTO;
import Team.C.Service.Spot.dto.provider.ProviderResponseDTO;
import Team.C.Service.Spot.dto.provider.ProviderUpdateDTO;
import Team.C.Service.Spot.exception.DuplicateEmailException;
import Team.C.Service.Spot.exception.DuplicatePhoneException;
import Team.C.Service.Spot.exception.InvalidCredentialsException;
import Team.C.Service.Spot.exception.ResourceNotFoundException;
import Team.C.Service.Spot.mapper.ProviderMapper;
import Team.C.Service.Spot.model.Provider;
import Team.C.Service.Spot.repositery.ProviderRepo;
import Team.C.Service.Spot.service.interfaces.IProviderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service Implementation for Provider Operations
 * Implements business logic for provider-related operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ProviderServiceImpl implements IProviderService {

    private final ProviderRepo providerRepo;
    private final PasswordEncoder passwordEncoder;
    private final ProviderMapper providerMapper;

    @Override
    public ProviderResponseDTO registerProvider(ProviderRegistrationDTO registrationDTO) {
        log.info("Registering new provider with email: {}", registrationDTO.getEmail());

        // Check if email already exists
        if (providerRepo.findByEmail(registrationDTO.getEmail()).isPresent()) {
            log.warn("Registration failed: Email already exists - {}", registrationDTO.getEmail());
            throw new DuplicateEmailException("Email already registered: " + registrationDTO.getEmail());
        }

        // Check if phone already exists
        if (providerRepo.findByPhone(registrationDTO.getPhone()).isPresent()) {
            log.warn("Registration failed: Phone already exists - {}", registrationDTO.getPhone());
            throw new DuplicatePhoneException("Phone number already registered: " + registrationDTO.getPhone());
        }

        // Map DTO to entity
        Provider provider = providerMapper.registrationDtoToEntity(registrationDTO);

        // Encode password
        provider.setPassword(passwordEncoder.encode(registrationDTO.getPassword()));

        // Save to database
        Provider savedProvider = providerRepo.save(provider);
        log.info("Provider registered successfully with ID: {}", savedProvider.getId());

        // Return response DTO (without password)
        return providerMapper.entityToResponseDto(savedProvider);
    }

    @Override
    public ProviderResponseDTO loginProvider(ProviderLoginDTO loginDTO) {
        log.info("Login attempt for provider email: {}", loginDTO.getEmail());

        // Find provider by email
        Provider provider = providerRepo.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> {
                    log.warn("Login failed: Invalid credentials for email - {}", loginDTO.getEmail());
                    return new InvalidCredentialsException("Invalid email or password");
                });

        // Verify password
        if (!passwordEncoder.matches(loginDTO.getPassword(), provider.getPassword())) {
            log.warn("Login failed: Incorrect password for email - {}", loginDTO.getEmail());
            throw new InvalidCredentialsException("Invalid email or password");
        }

        log.info("Provider logged in successfully: {}", provider.getId());

        // Return response DTO (without password)
        return providerMapper.entityToResponseDto(provider);
    }

    @Override
    @Transactional(readOnly = true)
    public ProviderResponseDTO getProviderById(Long id) {
        log.info("Fetching provider by ID: {}", id);

        Provider provider = providerRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with ID: " + id));

        return providerMapper.entityToResponseDto(provider);
    }

    @Override
    @Transactional(readOnly = true)
    public ProviderResponseDTO getProviderByEmail(String email) {
        log.info("Fetching provider by email: {}", email);

        Provider provider = providerRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with email: " + email));

        return providerMapper.entityToResponseDto(provider);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProviderResponseDTO> getAllProviders() {
        log.info("Fetching all providers");

        return providerRepo.findAll().stream()
                .map(providerMapper::entityToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProviderResponseDTO> getVerifiedProviders() {
        log.info("Fetching all verified providers");

        return providerRepo.findByVerified(true).stream()
                .map(providerMapper::entityToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProviderResponseDTO> getProvidersByCity(String city) {
        log.info("Fetching providers by city: {}", city);

        return providerRepo.findByCity(city).stream()
                .map(providerMapper::entityToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProviderResponseDTO> getProvidersByServiceType(String serviceType) {
        log.info("Fetching providers by service type: {}", serviceType);

        return providerRepo.findByServiceType(serviceType).stream()
                .map(providerMapper::entityToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public ProviderResponseDTO updateProvider(Long id, ProviderUpdateDTO updateDTO) {
        log.info("Updating provider with ID: {}", id);

        // Find existing provider
        Provider provider = providerRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with ID: " + id));

        // If phone is being updated, check for duplicates (excluding current provider)
        if (updateDTO.getPhone() != null && !updateDTO.getPhone().equals(provider.getPhone())) {
            Optional<Provider> existingProvider = providerRepo.findByPhone(updateDTO.getPhone());
            if (existingProvider.isPresent() && !existingProvider.get().getId().equals(id)) {
                log.warn("Update failed: Phone already exists - {}", updateDTO.getPhone());
                throw new DuplicatePhoneException("Phone number already in use: " + updateDTO.getPhone());
            }
        }

        // Update entity from DTO
        provider = providerMapper.updateEntityFromDto(provider, updateDTO);

        // Save updated entity
        Provider updatedProvider = providerRepo.save(provider);
        log.info("Provider updated successfully: {}", updatedProvider.getId());

        // Return response DTO (without password)
        return providerMapper.entityToResponseDto(updatedProvider);
    }

    @Override
    public void deleteProvider(Long id) {
        log.info("Deleting provider with ID: {}", id);

        if (!providerRepo.existsById(id)) {
            throw new ResourceNotFoundException("Provider not found with ID: " + id);
        }

        providerRepo.deleteById(id);
        log.info("Provider deleted successfully: {}", id);
    }

    @Override
    public void changePassword(Long id, String currentPassword, String newPassword) {
        log.info("Changing password for provider ID: {}", id);

        Provider provider = providerRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with ID: " + id));

        // Verify current password
        if (!passwordEncoder.matches(currentPassword, provider.getPassword())) {
            log.warn("Password change failed: Incorrect current password for provider ID: {}", id);
            throw new InvalidCredentialsException("Current password is incorrect");
        }

        // Update password
        provider.setPassword(passwordEncoder.encode(newPassword));
        providerRepo.save(provider);

        log.info("Password changed successfully for provider ID: {}", id);
    }

    @Override
    public void verifyProvider(Long id) {
        log.info("Verifying provider with ID: {}", id);

        Provider provider = providerRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with ID: " + id));

        provider.setVerified(true);
        providerRepo.save(provider);

        log.info("Provider verified successfully: {}", id);
    }

    @Override
    public void unverifyProvider(Long id) {
        log.info("Unverifying provider with ID: {}", id);

        Provider provider = providerRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with ID: " + id));

        provider.setVerified(false);
        providerRepo.save(provider);

        log.info("Provider unverified successfully: {}", id);
    }
}

