# Google Maps Integration Setup

## 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy your API key

## 2. Configure API Key Restrictions (Recommended)

### Application Restrictions:
- HTTP referrers (web sites)
- Add your domains: `localhost:3000`, `yourdomain.com`

### API Restrictions:
- Restrict key to these APIs:
  - Maps JavaScript API
  - Places API  
  - Geocoding API

## 3. Environment Setup

Create `.env` file in project root:
```
REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

## 4. Features Included

- **Address Autocomplete**: Smart address suggestions
- **Interactive Map**: Click to set location
- **Geocoding**: Convert addresses to coordinates
- **Reverse Geocoding**: Get address from coordinates
- **India-focused**: Restricted to Indian addresses

## 5. Usage in Components

```tsx
// Address autocomplete
<AddressAutocomplete
  onPlaceSelect={(place) => {
    setValue('address', place.address);
    setValue('city', place.city);
    setValue('coordinates', { lat: place.lat, lng: place.lng });
  }}
/>

// Interactive map
<GoogleMap
  address={formData.address}
  onLocationSelect={(location) => {
    setValue('coordinates', { lat: location.lat, lng: location.lng });
  }}
/>
```

## 6. Billing Information

- Google Maps has a free tier: $200 credit monthly
- Typical usage for property app should stay within free limits
- Monitor usage in Google Cloud Console

## 7. Production Considerations

- Set up proper domain restrictions
- Monitor API usage and costs
- Consider caching geocoding results
- Implement error handling for API failures