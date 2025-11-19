/**
 * Calculate the distance between two geographic coordinates using the Haversine formula
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Distance in kilometers
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Find the nearest organization to a given coordinate
 */
export function findNearestOrganisation(
  latitude: number,
  longitude: number,
  organisations: Array<{
    id: string;
    coverageCenterLat: number;
    coverageCenterLng: number;
    active: boolean;
  }>
): { id: string; distance: number } | null {
  const activeOrgs = organisations.filter((org) => org.active);

  if (activeOrgs.length === 0) {
    return null;
  }

  let nearest = activeOrgs[0];
  let minDistance = haversineDistance(
    latitude,
    longitude,
    nearest.coverageCenterLat,
    nearest.coverageCenterLng
  );

  for (let i = 1; i < activeOrgs.length; i++) {
    const org = activeOrgs[i];
    const distance = haversineDistance(
      latitude,
      longitude,
      org.coverageCenterLat,
      org.coverageCenterLng
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearest = org;
    }
  }

  return {
    id: nearest.id,
    distance: minDistance,
  };
}
