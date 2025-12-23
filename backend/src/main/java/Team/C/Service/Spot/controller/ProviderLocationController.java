package Team.C.Service.Spot.controller;

import Team.C.Service.Spot.model.ProviderLocation;
import Team.C.Service.Spot.services.ProviderLocationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/provider/location")
@CrossOrigin(origins = "http://localhost:5173")
public class ProviderLocationController {

    private final ProviderLocationService providerLocationService;

    public ProviderLocationController(ProviderLocationService providerLocationService) {
        this.providerLocationService = providerLocationService;
    }

    @PostMapping("/{providerId}")
    public ProviderLocation updateLocation(
            @PathVariable Long providerId,
            @RequestParam double latitude,
            @RequestParam double longitude
    ) {
        return providerLocationService.updateLocation(providerId, latitude, longitude);
    }

    // ✅ GET – customer tracks provider
    @GetMapping("/{providerId}")
    public ProviderLocation getLocation(@PathVariable Long providerId) {
        return providerLocationService.getLocation(providerId);
    }
}
