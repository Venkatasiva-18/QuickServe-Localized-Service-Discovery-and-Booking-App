package Team.C.Service.Spot.services;

import Team.C.Service.Spot.model.Review;
import Team.C.Service.Spot.repositery.ReviewRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewService {
    
    private final ReviewRepo reviewRepo;
    private final ServiceService serviceService;
    
    public List<Review> getAllReviews() {
        return reviewRepo.findAll();
    }
    
    public Optional<Review> getReviewById(Long id) {
        return reviewRepo.findById(id);
    }
    
    public List<Review> getReviewsByService(Long serviceId) {
        return reviewRepo.findByServiceId(serviceId);
    }
    
    public List<Review> getReviewsByCustomer(Long customerId) {
        return reviewRepo.findByCustomerId(customerId);
    }
    
    public Double getServiceRating(Long serviceId) {
        return reviewRepo.getAverageRatingByServiceId(serviceId);
    }
    
    public Integer getServiceReviewCount(Long serviceId) {
        return reviewRepo.getReviewCountByServiceId(serviceId);
    }
    
    public Review createReview(Review review) {
        Review savedReview = reviewRepo.save(review);
        
        Double avgRating = getServiceRating(review.getService().getId());
        Integer reviewCount = getServiceReviewCount(review.getService().getId());
        
        serviceService.updateServiceRating(review.getService().getId(), avgRating != null ? avgRating : 0, reviewCount != null ? reviewCount : 0);
        
        return savedReview;
    }
    
    public Review updateReview(Long id, Review updatedReview) {
        Review result = reviewRepo.findById(id)
                .map(review -> {
                    review.setRating(updatedReview.getRating());
                    review.setComment(updatedReview.getComment());
                    review.setUpdatedAt(new java.util.Date());
                    return reviewRepo.save(review);
                })
                .orElse(null);
        
        if (result != null) {
            Double avgRating = getServiceRating(result.getService().getId());
            Integer reviewCount = getServiceReviewCount(result.getService().getId());
            serviceService.updateServiceRating(result.getService().getId(), avgRating != null ? avgRating : 0, reviewCount != null ? reviewCount : 0);
        }
        
        return result;
    }
    
    public boolean deleteReview(Long id) {
        Optional<Review> review = reviewRepo.findById(id);
        if (review.isPresent()) {
            Long serviceId = review.get().getService().getId();
            reviewRepo.deleteById(id);
            
            Double avgRating = getServiceRating(serviceId);
            Integer reviewCount = getServiceReviewCount(serviceId);
            serviceService.updateServiceRating(serviceId, avgRating != null ? avgRating : 0, reviewCount != null ? reviewCount : 0);
            
            return true;
        }
        return false;
    }
}
