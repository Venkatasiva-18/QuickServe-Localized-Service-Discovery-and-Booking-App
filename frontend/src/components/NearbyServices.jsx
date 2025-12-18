import React, { useState, useEffect, useRef } from 'react';
import { customerService } from '../../services/customerService';
import { useNavigate } from "react-router-dom";
import { testEnvironment } from '../../utils/testEnv';
import { GOOGLE_MAPS_API_KEY } from '../../config/constants';
import { 
  MapPin, 
  Search, 
  Navigation, 
  Star,
  DollarSign,
  Clock,
  Loader,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-toastify';

const NearbyServices = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [sortBy, setSortBy] = useState('distance');
  
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]);

  
  // Load Google Maps Script
  // Load Google Maps Script (SAFE – LOAD ONCE)
  useEffect(() => {
    if (window.google?.maps) {
      setMapLoaded(true);
      return;
    }

    if (document.getElementById("google-maps-script")) {
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setMapLoaded(true);
    };

    script.onerror = () => {
      setMapError("Failed to load Google Maps");
      toast.error("Failed to load Google Maps");
    };

    document.head.appendChild(script);
  }, []);

  
  // Get user location
  useEffect(() => {
    console.log('📍 Getting user location...');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log('✅ Location detected:', location);
          setUserLocation(location);
          toast.success('Location detected!');
        },
        (error) => {
          console.error('⚠️ Geolocation error:', error);
          // Fallback to default location (Delhi)
          const defaultLocation = { lat: 28.6139, lng: 77.2090 };
          setUserLocation(defaultLocation);
          toast.warning('Using default location (Delhi)');
        }
      );
    } else {
      console.error('❌ Geolocation not supported');
      setUserLocation({ lat: 28.6139, lng: 77.2090 });
      toast.error('Geolocation not supported by your browser');
    }
  }, []);

  // Fetch services and categories
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    testEnvironment();
  }, []);
  // Initialize map ONCE when ready
  useEffect(() => {
    if (!mapLoaded || !userLocation || !mapRef.current) return;
    if (googleMapRef.current) return;

    initializeMap();
  }, [mapLoaded, userLocation]);
// Initialize map when both conditions are met
  useEffect(() => {
    if (mapLoaded && userLocation && mapRef.current && !googleMapRef.current) {
      console.log('🎯 Initializing map...');
      initializeMap();
    }
  }, [mapLoaded, userLocation]);

  // Update markers when services change
  useEffect(() => {
    if (googleMapRef.current && filteredServices.length > 0) {
      console.log('📍 Updating map markers...');
      updateMapMarkers();
    }
  }, [filteredServices, selectedService]);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching services and categories...');
      
      const [servicesData, categoriesData] = await Promise.all([
        customerService.getAllServices(),
        customerService.getCategories()
      ]);

      console.log('✅ Services fetched:', servicesData.length);
      console.log('✅ Categories fetched:', categoriesData.length);

      // Add mock coordinates if not present
      const servicesWithCoords = servicesData.map(service => ({
        ...service,
        lat: service.provider?.latitude || (28.6139 + (Math.random() - 0.5) * 0.1),
        lng: service.provider?.longitude || (77.2090 + (Math.random() - 0.5) * 0.1),
      }));

      setServices(servicesWithCoords);
      setFilteredServices(servicesWithCoords);
      setCategories(categoriesData);
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const initializeMap = () => {
    try {
      console.log('🗺️ Creating map instance...');
      
      const map = new window.google.maps.Map(mapRef.current, {
        center: userLocation,
        zoom: 13,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });

      console.log('✅ Map created');

      // Add user location marker
      new window.google.maps.Marker({
        position: userLocation,
        map: map,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#4F46E5',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3,
        },
        title: 'Your Location',
        zIndex: 1000,
      });

      // Add user location circle (5km radius)
      new window.google.maps.Circle({
        map: map,
        center: userLocation,
        radius: 5000,
        fillColor: '#4F46E5',
        fillOpacity: 0.1,
        strokeColor: '#4F46E5',
        strokeOpacity: 0.3,
        strokeWeight: 1,
      });

      googleMapRef.current = map;
      console.log('✅ Map initialized successfully');
      
    } catch (error) {
      console.error('❌ Error initializing map:', error);
      setMapError('Failed to initialize map');
    }
  };

  const updateMapMarkers = () => {
    try {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      if (!window.google || !googleMapRef.current) {
        console.warn('⚠️ Map not ready for markers');
        return;
      }

      console.log(`📍 Adding ${filteredServices.length} markers...`);

      // Add service markers
      filteredServices.forEach((service, index) => {
        const marker = new window.google.maps.Marker({
          position: { lat: service.lat, lng: service.lng },
          map: googleMapRef.current,
          title: service.name,
          icon: {
            url: selectedService?.id === service.id
              ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
              : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
          },
          animation: window.google.maps.Animation.DROP,
        });

        // Info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; max-width: 200px; font-family: system-ui;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #111;">${service.name}</h3>
              <p style="margin: 0 0 4px 0; color: #666; font-size: 14px;">${service.provider?.businessName || 'Provider'}</p>
              <p style="margin: 0; color: #10b981; font-weight: bold; font-size: 16px;">₹${service.price}</p>
            </div>
          `,
        });

        marker.addListener('click', () => {
          // Close all other info windows
          markersRef.current.forEach(m => {
            if (m.infoWindow) m.infoWindow.close();
          });
          
          setSelectedService(service);
          infoWindow.open(googleMapRef.current, marker);
          
          // Scroll to service card
          const element = document.getElementById(`service-${service.id}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        });

        marker.infoWindow = infoWindow;
        markersRef.current.push(marker);
      });

      console.log('✅ Markers added successfully');
    } catch (error) {
      console.error('❌ Error updating markers:', error);
    }
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    if (!window.google?.maps?.geometry) return null;

    const from = new window.google.maps.LatLng(lat1, lng1);
    const to = new window.google.maps.LatLng(lat2, lng2);
    const distance =
      window.google.maps.geometry.spherical.computeDistanceBetween(from, to);

    return (distance / 1000).toFixed(1);
  };


  const handleSearch = () => {
    let filtered = [...services];

    if (selectedCategory) {
      filtered = filtered.filter(s => s.category?.id === parseInt(selectedCategory));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.description?.toLowerCase().includes(query) ||
        s.provider?.businessName?.toLowerCase().includes(query)
      );
    }

    if (userLocation) {
      filtered = filtered.map(service => ({
        ...service,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          service.lat,
          service.lng
        )
      }));
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return (a.distance || 0) - (b.distance || 0);
        case 'rating':
          return (b.provider?.averageRating || 0) - (a.provider?.averageRating || 0);
        case 'price':
          return a.price - b.price;
        default:
          return 0;
      }
    });

    setFilteredServices(filtered);
  };

  const centerMapOnService = (service) => {
    if (googleMapRef.current) {
      googleMapRef.current.panTo({ lat: service.lat, lng: service.lng });
      googleMapRef.current.setZoom(15);
      setSelectedService(service);
    }
  };

  const handleGetDirections = (service) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${service.lat},${service.lng}`;
      window.open(url, '_blank');
    }
  };

  useEffect(() => {
    handleSearch();
  }, [selectedCategory, searchQuery, sortBy, services, userLocation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gray-50">
      {/* Left Panel */}
      <div className="w-1/3 flex flex-col bg-white shadow-lg">
        <div className="p-4 border-b space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Find Nearby Services</h1>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="distance">Nearest</option>
              <option value="rating">Top Rated</option>
              <option value="price">Lowest Price</option>
            </select>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{filteredServices.length} services found</span>
            {userLocation && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-blue-600" />
                Location detected
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredServices.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No services found</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  selected={selectedService?.id === service.id}
                  onSelect={() => centerMapOnService(service)}
                  onDirections={() => handleGetDirections(service)}
                  navigate={navigate}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Map */}
      <div className="flex-1 min-w-0 relative h-full">
        <div
          ref={mapRef}
          className="absolute inset-0"
        />

        {!mapLoaded && !mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-gray-600">Loading map...</p>
              <p className="text-gray-400 text-sm mt-2">
                Powered by Google Maps
              </p>
            </div>
          </div>
        )}

        {mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center p-8">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 font-semibold mb-2">Map Error</p>
              <p className="text-gray-600 mb-4">{mapError}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ServiceCard = ({ service, selected, onSelect, onDirections, navigate }) => {
  const distance = service.distance ?? '—';
  const rating = service.provider?.averageRating || 0;

  return (
    <div
      id={`service-${service.id}`}
      onClick={onSelect}
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
        selected
          ? 'border-blue-600 bg-blue-50 shadow-lg'
          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900">{service.name}</h3>
          <p className="text-sm text-gray-600">{service.provider?.businessName}</p>
        </div>
        <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded">
          <Star className="w-4 h-4 text-yellow-600 fill-current" />
          <span className="text-sm font-semibold text-yellow-900">{rating.toFixed(1)}</span>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {service.description}
      </p>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1 text-gray-600">
            <MapPin className="w-4 h-4" />
            {distance} km
          </span>
          <span className="flex items-center gap-1 text-gray-600">
            <Clock className="w-4 h-4" />
            {service.duration} min
          </span>
        </div>
        <span className="text-lg font-bold text-green-600">₹{service.price}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDirections();
          }}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Navigation className="w-4 h-4" />
          Directions
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/customer/book/${service.id}`);
          }}
          className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Book Now
        </button>

      </div>
    </div>
  );
};

export default NearbyServices;
