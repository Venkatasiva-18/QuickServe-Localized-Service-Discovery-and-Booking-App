import React, { useState, useEffect } from "react";
import "./Reviews.css";
import { FaStar } from "react-icons/fa";

export default function Reviews() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });
  const [customerId, setCustomerId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    const storedCustomerId = localStorage.getItem("customerId");
    if (storedCustomerId) {
      setCustomerId(storedCustomerId);
    }
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/services");
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (serviceId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/reviews/service/${serviceId}`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    fetchReviews(service.id);
    setNewReview({ rating: 5, comment: "" });
    setSubmitMessage("");
  };

  const handleRatingChange = (rating) => {
    setNewReview({ ...newReview, rating });
  };

  const handleCommentChange = (e) => {
    setNewReview({ ...newReview, comment: e.target.value });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!customerId) {
      setSubmitMessage("Please log in to leave a review.");
      return;
    }

    if (!newReview.comment.trim()) {
      setSubmitMessage("Please enter a comment.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: { id: selectedService.id },
          customer: { id: customerId },
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      });

      if (response.ok) {
        setSubmitMessage("Review submitted successfully!");
        setNewReview({ rating: 5, comment: "" });
        fetchReviews(selectedService.id);
      } else {
        setSubmitMessage("Failed to submit review. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setSubmitMessage("Error submitting review.");
    }
  };

  const renderStars = (rating, interactive = false, onRate = null) => {
    return (
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`star ${star <= rating ? "filled" : "empty"} ${
              interactive ? "interactive" : ""
            }`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
    );
  };

  if (selectedService) {
    return (
      <div className="reviews-detail-container">
        <button className="back-btn" onClick={() => setSelectedService(null)}>
          ← Back to Services
        </button>

        <div className="service-review-section">
          <div className="service-header">
            <h2>{selectedService.name}</h2>
            <div className="service-rating-display">
              <span className="rating-number">{selectedService.rating || "0"}</span>
              {renderStars(Math.round(selectedService.rating || 0))}
              <span className="review-count">({selectedService.reviewCount || 0} reviews)</span>
            </div>
          </div>

          <div className="review-form-section">
            <h3>Leave a Review</h3>
            {submitMessage && (
              <div className={`message ${submitMessage.includes("success") ? "success" : "error"}`}>
                {submitMessage}
              </div>
            )}
            <form onSubmit={handleSubmitReview}>
              <div className="form-group">
                <label>Your Rating:</label>
                {renderStars(newReview.rating, true, handleRatingChange)}
              </div>

              <div className="form-group">
                <label>Your Review:</label>
                <textarea
                  value={newReview.comment}
                  onChange={handleCommentChange}
                  placeholder="Share your experience with this service..."
                  rows="4"
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                Submit Review
              </button>
            </form>
          </div>

          <div className="reviews-list-section">
            <h3>Reviews ({reviews.length})</h3>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <div>
                      <strong>{review.customer.name}</strong>
                      <div>{renderStars(review.rating)}</div>
                    </div>
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet. Be the first to review this service!</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reviews-container">
      <div className="reviews-header">
        <h1>Service Reviews</h1>
        <p>See what others are saying about local services</p>
      </div>

      <div className="services-review-list">
        {loading ? (
          <p>Loading services...</p>
        ) : services.length > 0 ? (
          services.map((service) => (
            <div key={service.id} className="service-review-card">
              <div className="service-info">
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <div className="service-stats">
                  <span className="stat">
                    <strong>Rating:</strong> {service.rating || "0"} / 5
                  </span>
                  <span className="stat">
                    <strong>Reviews:</strong> {service.reviewCount || 0}
                  </span>
                </div>
              </div>
              <button
                className="view-reviews-btn"
                onClick={() => handleServiceSelect(service)}
              >
                View & Write Reviews
              </button>
            </div>
          ))
        ) : (
          <p>No services found.</p>
        )}
      </div>
    </div>
  );
}
