package Team.C.Service.Spot.repositery;

import Team.C.Service.Spot.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepo extends JpaRepository<Review, Long> {
    List<Review> findByServiceId(Long serviceId);
    
    List<Review> findByCustomerId(Long customerId);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.service.id = :serviceId")
    Double getAverageRatingByServiceId(@Param("serviceId") Long serviceId);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.service.id = :serviceId")
    Integer getReviewCountByServiceId(@Param("serviceId") Long serviceId);
}
