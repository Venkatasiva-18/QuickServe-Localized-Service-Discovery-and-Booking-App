package Team.C.Service.Spot.controller;

import Team.C.Service.Spot.model.Review;
import Team.C.Service.Spot.services.ReviewService;
import Team.C.Service.Spot.services.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Slf4j
public class ReviewController {
    
    private final ReviewService reviewService;
    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getReviewById(@PathVariable Long id) {
        return reviewService.getReviewById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<Review>> getReviewsByService(@PathVariable Long serviceId) {
        return ResponseEntity.ok(reviewService.getReviewsByService(serviceId));
    }
    
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Review>> getReviewsByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(reviewService.getReviewsByCustomer(customerId));
    }
    
    @GetMapping("/service/{serviceId}/rating")
    public ResponseEntity<Double> getServiceRating(@PathVariable Long serviceId) {
        return ResponseEntity.ok(reviewService.getServiceRating(serviceId));
    }
    
    @GetMapping("/service/{serviceId}/count")
    public ResponseEntity<Integer> getServiceReviewCount(@PathVariable Long serviceId) {
        return ResponseEntity.ok(reviewService.getServiceReviewCount(serviceId));
    }
    
    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody Review review) {
        try {
            // Create the review
            Review createdReview = reviewService.createReview(review);

            // Send notification to provider
            if (createdReview != null &&
                createdReview.getService() != null &&
                createdReview.getService().getProvider() != null &&
                createdReview.getCustomer() != null) {

                String providerEmail = createdReview.getService().getProvider().getEmail();
                String customerName = createdReview.getCustomer().getName();
                int rating = createdReview.getRating();
                String serviceName = createdReview.getService().getName();

                log.info("Sending review notification to provider: {}", providerEmail);

                // Send notification to provider
                notificationService.notifyReviewReceived(
                    providerEmail,
                    customerName,
                    createdReview.getId(),
                    rating,
                    serviceName
                );
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(createdReview);
        } catch (Exception e) {
            log.error("Error creating review: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateReview(@PathVariable Long id, @RequestBody Review review) {
        Review updated = reviewService.updateReview(id, review);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        if (reviewService.deleteReview(id)) {
            return ResponseEntity.ok("Review deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }
}
