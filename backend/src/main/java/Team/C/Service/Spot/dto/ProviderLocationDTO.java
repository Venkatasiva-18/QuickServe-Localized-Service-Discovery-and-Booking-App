package Team.C.Service.Spot.dto;

public class ProviderLocationDTO {
    private Long providerId;
    private double latitude;
    private double longitude;

    public Long getProviderId() {
        return providerId;
    }
    public void setProviderId(Long providerId) {
        this.providerId = providerId;
    }

    public double getLatitude() {
        return latitude;
    }
    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }
    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }
}
