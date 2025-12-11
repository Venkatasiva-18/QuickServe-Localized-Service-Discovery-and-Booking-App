package Team.C.Service.Spot.controller;

import Team.C.Service.Spot.model.Review;
import Team.C.Service.Spot.services.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {
    
    private final ReviewService reviewService;
    
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
        return ResponseEntity.status(HttpStatus.CREATED).body(reviewService.createReview(review));
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
