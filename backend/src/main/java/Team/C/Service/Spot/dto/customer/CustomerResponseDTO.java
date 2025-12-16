package Team.C.Service.Spot.dto.customer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * DTO for Customer Response
 * Used when returning customer data in API responses
 * DOES NOT contain password or other sensitive information
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerResponseDTO {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String doorNo;
    private String addressLine;
    private String city;
    private String state;
    private Integer pincode;
    private String country;
    private Double latitude;
    private Double longitude;
    private Boolean verified;
    private String role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Profile image as Base64 string
    private String profileImage;

    // Note: NO password field in response DTO!
}

