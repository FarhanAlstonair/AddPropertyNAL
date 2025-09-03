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
    let isMounted = true;

    const initializeMap = () => {
      if (!mapRef.current || !isMounted) return;
      
      try {
        // Use coordinates if provided, otherwise default to India center
        const center = (coordinates && coordinates.lat && coordinates.lng) 
          ? coordinates 
          : { lat: 20.5937, lng: 78.9629 }; // India center
        
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: center,
          zoom: (coordinates && coordinates.lat && coordinates.lng) ? zoom : 5,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });

        if (isMounted) {
          setMap(mapInstance);

          // Add click listener only if onLocationSelect is provided
          if (onLocationSelect) {
            mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
              if (e.latLng && isMounted) {
                const lat = e.latLng.lat();
                const lng = e.latLng.lng();
                
                // Reverse geocoding
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
                  if (status === 'OK' && results?.[0] && isMounted) {
                    onLocationSelect({
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
                    if (isMounted) setMarker(newMarker);
                  }
                });
              }
            });
          }

          // If coordinates provided, use them directly
          if (coordinates && coordinates.lat && coordinates.lng) {
            const newMarker = new google.maps.Marker({
              position: coordinates,
              map: mapInstance,
              title: address || 'Property Location'
            });
            if (isMounted) setMarker(newMarker);
          }
          // Otherwise, if address provided, geocode it
          else if (address) {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address }, (results: any, status: any) => {
              if (status === 'OK' && results?.[0] && isMounted) {
                const location = results[0].geometry.location;
                mapInstance.setCenter(location);
                
                const newMarker = new google.maps.Marker({
                  position: location,
                  map: mapInstance,
                  title: address
                });
                if (isMounted) setMarker(newMarker);
              }
            });
          }
        }
      } catch (error) {
        console.error('Error initializing map:', error);
        if (isMounted) {
          setHasError(true);
          setIsLoading(false);
        }
      }
    };

    const loadGoogleMaps = () => {
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        setIsLoading(false);
        setTimeout(initializeMap, 100); // Small delay to ensure DOM is ready
        return;
      }

      // Check if script is already being loaded
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        // Wait for existing script to load
        const handleLoad = () => {
          if (window.google && window.google.maps && isMounted) {
            setIsLoading(false);
            setTimeout(initializeMap, 100);
          }
        };
        existingScript.addEventListener('load', handleLoad);
        return () => existingScript.removeEventListener('load', handleLoad);
      }

      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.error('Google Maps API key is missing');
        if (isMounted) {
          setHasError(true);
          setIsLoading(false);
        }
        return;
      }

      // Create unique callback name
      const callbackName = `initGoogleMaps_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=${callbackName}`;
      script.async = true;
      script.defer = true;
      script.onerror = (error) => {
        console.error('Failed to load Google Maps script:', error);
        if (isMounted) {
          setHasError(true);
          setIsLoading(false);
        }
      };
      
      // Set global callback
      (window as any)[callbackName] = () => {
        try {
          if (isMounted) {
            setIsLoading(false);
            setTimeout(initializeMap, 100);
          }
          // Clean up callback
          delete (window as any)[callbackName];
        } catch (error) {
          console.error('Error initializing Google Maps:', error);
          if (isMounted) {
            setHasError(true);
            setIsLoading(false);
          }
        }
      };
      
      document.head.appendChild(script);
    };

    loadGoogleMaps();

    return () => {
      isMounted = false;
    };
  }, [address, coordinates, onLocationSelect, zoom]);

  // Reset loading state when props change
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [address, coordinates]);

  if (hasError) {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    
    // Try iframe embed if API key is available
    if (apiKey) {
      const mapUrl = coordinates 
        ? `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${coordinates.lat},${coordinates.lng}&zoom=15`
        : `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(address || 'Bengaluru, India')}`;
      
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
            title="Property Location Map"
          />
        </div>
      );
    }
    
    // Fallback to static placeholder
    return (
      <div style={{ height, width: '100%' }} className="flex items-center justify-center bg-gray-100">
        <div className="text-center p-6">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-gray-700 text-sm font-medium mb-2">📍 {address || 'Property Location'}</p>
          <p className="text-gray-500 text-xs">Map temporarily unavailable</p>
          {(coordinates?.lat && coordinates?.lng) && (
            <p className="text-gray-400 text-xs mt-1">
              {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
            </p>
          )}
        </div>
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