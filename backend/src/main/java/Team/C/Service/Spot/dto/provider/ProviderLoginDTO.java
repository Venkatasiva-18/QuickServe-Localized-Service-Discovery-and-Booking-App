package Team.C.Service.Spot.dto.provider;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Provider Login
 * Used when a service provider attempts to authenticate
 * Contains only email and password
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProviderLoginDTO {

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
}

