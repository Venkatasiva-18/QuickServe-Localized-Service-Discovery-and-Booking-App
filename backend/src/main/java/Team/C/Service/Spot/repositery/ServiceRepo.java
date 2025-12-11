package Team.C.Service.Spot.repositery;

import Team.C.Service.Spot.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceRepo extends JpaRepository<Service, Long> {
    List<Service> findByProviderId(Long providerId);
    
    List<Service> findByCategoryId(Long categoryId);
    
    List<Service> findByCityAndStateAndPincode(String city, String state, Integer pincode);
    
    List<Service> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT s FROM Service s WHERE s.city = :city AND s.state = :state AND s.category.id = :categoryId AND s.isActive = true")
    List<Service> findByLocationAndCategory(@Param("city") String city, @Param("state") String state, @Param("categoryId") Long categoryId);
    
    @Query("SELECT s FROM Service s WHERE s.city = :city AND s.state = :state AND s.isActive = true ORDER BY s.rating DESC")
    List<Service> findByLocationOrderByRating(@Param("city") String city, @Param("state") String state);
    
    @Query("SELECT s FROM Service s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')) AND s.city = :city AND s.isActive = true")
    List<Service> searchByNameAndLocation(@Param("keyword") String keyword, @Param("city") String city);
}
