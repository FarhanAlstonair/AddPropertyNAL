import React, { useEffect, useRef } from 'react';

interface AddressAutocompleteProps {
  onPlaceSelect: (place: {
    address: string;
    city: string;
    lat: number;
    lng: number;
  }) => void;
  placeholder?: string;
  className?: string;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  onPlaceSelect,
  placeholder = "Enter address...",
  className = ""
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        initializeAutocomplete();
        return;
      }

      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.error('Google Maps API key is missing');
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleAutocomplete`;
      script.async = true;
      script.defer = true;
      script.onerror = () => console.error('Failed to load Google Maps');
      
      // Set global callback
      (window as any).initGoogleAutocomplete = initializeAutocomplete;
      
      document.head.appendChild(script);
    };

    const initializeAutocomplete = () => {
      if (inputRef.current) {
        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          types: ['address'],
          componentRestrictions: { country: 'IN' } // Restrict to India
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          
          if (place.geometry?.location) {
            const addressComponents = place.address_components || [];
            const city = addressComponents.find(
              (component: any) => component.types.includes('locality') || 
                          component.types.includes('administrative_area_level_2')
            )?.long_name || '';

            onPlaceSelect({
              address: place.formatted_address || '',
              city,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            });
          }
        });
      }
    };

    loadGoogleMaps();
  }, [onPlaceSelect]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder={placeholder}
      className={className}
    />
  );
};

export default AddressAutocomplete;