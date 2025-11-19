export interface GeocodedAddress {
  formattedAddress: string;
  city: string;
  county: string;
  country: string;
  postalCode?: string;
}

/**
 * Reverse geocode coordinates to address using Google Maps Geocoding API
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<GeocodedAddress> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    throw new Error('Google Maps API key is not configured');
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

  const response = await fetch(url, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Google Maps API error: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.status !== 'OK' || data.results.length === 0) {
    throw new Error('Failed to reverse geocode coordinates');
  }

  const result = data.results[0];
  const addressComponents = result.address_components;

  // Extract city, county, country
  let city = '';
  let county = '';
  let country = '';
  let postalCode = '';

  for (const component of addressComponents) {
    const types = component.types;

    if (types.includes('locality')) {
      city = component.long_name;
    } else if (types.includes('administrative_area_level_1')) {
      county = component.long_name;
    } else if (types.includes('country')) {
      country = component.short_name;
    } else if (types.includes('postal_code')) {
      postalCode = component.long_name;
    }
  }

  return {
    formattedAddress: result.formatted_address,
    city,
    county,
    country,
    postalCode,
  };
}

/**
 * Check if coordinates are within Dublin
 */
export function isInDublin(city: string): boolean {
  return city.toLowerCase().includes('dublin');
}

/**
 * Get current position from browser
 */
export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}
