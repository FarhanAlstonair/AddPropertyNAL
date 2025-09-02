import React, { useEffect, useRef, useState } from 'react';

interface GoogleMapProps {
  address?: string;
  coordinates?: { lat: number; lng: number };
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
  height?: string;
  zoom?: number;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  address,
  coordinates,
  onLocationSelect, 
  height = '400px',
  zoom = 15 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadGoogleMaps = () => {
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        setIsLoading(false);
        initializeMap();
        return;
      }

      // Check if script is already being loaded
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        // Wait for existing script to load
        existingScript.addEventListener('load', () => {
          if (window.google && window.google.maps) {
            setIsLoading(false);
            initializeMap();
          }
        });
        return;
      }

      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.error('Google Maps API key is missing');
        setHasError(true);
        setIsLoading(false);
        return;
      }

      // Create unique callback name
      const callbackName = `initGoogleMaps_${Date.now()}`;
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=${callbackName}`;
      script.async = true;
      script.defer = true;
      script.onerror = (error) => {
        console.error('Failed to load Google Maps script:', error);
        setHasError(true);
        setIsLoading(false);
      };
      
      // Set global callback
      (window as any)[callbackName] = () => {
        try {
          setIsLoading(false);
          initializeMap();
          // Clean up callback
          delete (window as any)[callbackName];
        } catch (error) {
          console.error('Error initializing Google Maps:', error);
          setHasError(true);
          setIsLoading(false);
        }
      };
      
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (mapRef.current) {
        // Use coordinates if provided, otherwise default to Bengaluru
        const center = (coordinates && coordinates.lat && coordinates.lng) 
          ? coordinates 
          : { lat: 12.9716, lng: 77.5946 }; // Bengaluru, India
        
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: center,
          zoom: (coordinates && coordinates.lat && coordinates.lng) ? zoom : 12,
        });

        setMap(mapInstance);

        // Add click listener
        mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            
            // Reverse geocoding
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
              if (status === 'OK' && results?.[0]) {
                onLocationSelect?.({
                  lat,
                  lng,
                  address: results[0].formatted_address
                });
                
                // Update marker
                if (marker) marker.setMap(null);
                const newMarker = new google.maps.Marker({
                  position: { lat, lng },
                  map: mapInstance,
                });
                setMarker(newMarker);
              }
            });
          }
        });

        // If coordinates provided, use them directly
        if (coordinates) {
          const newMarker = new google.maps.Marker({
            position: coordinates,
            map: mapInstance,
          });
          setMarker(newMarker);
        }
        // Otherwise, if address provided, geocode it
        else if (address) {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ address }, (results: any, status: any) => {
            if (status === 'OK' && results?.[0]) {
              const location = results[0].geometry.location;
              mapInstance.setCenter(location);
              
              const newMarker = new google.maps.Marker({
                position: location,
                map: mapInstance,
              });
              setMarker(newMarker);
            }
          });
        }
      }
    };

    loadGoogleMaps();
  }, [address, coordinates, onLocationSelect, zoom]);

  // Reset loading state when props change
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [address, coordinates]);

  if (hasError) {
    const mapUrl = coordinates 
      ? `https://www.google.com/maps/embed/v1/view?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&center=${coordinates.lat},${coordinates.lng}&zoom=15`
      : `https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(address || 'Bengaluru, India')}`;
    
    return (
      <div style={{ height, width: '100%' }} className="relative">
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onError={() => {
            // Fallback to static placeholder if iframe also fails
            return (
              <div className="flex items-center justify-center bg-gray-100 h-full">
                <div className="text-center p-6">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <p className="text-gray-700 text-sm">📍 {address || 'Location not available'}</p>
                </div>
              </div>
            );
          }}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div 
        style={{ height, width: '100%' }} 
        className="flex items-center justify-center bg-gray-50"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-gray-500 text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} style={{ height, width: '100%' }} />;
};

export default GoogleMap;