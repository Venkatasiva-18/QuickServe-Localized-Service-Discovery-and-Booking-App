package Team.C.Service.Spot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDTO {
    
    private Long id;
    private Long serviceId;
    private Long customerId;
    private String customerName;
    private Integer rating;
    private String comment;
    private Date createdAt;
    private Date updatedAt;
}
