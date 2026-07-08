/**
 * OSRM (Open Source Routing Machine) Routing Service
 * Calls public OSRM APIs to calculate driving directions between coordinates.
 */

export const fetchRoute = async (startCoords, endCoords) => {
  const [startLon, startLat] = startCoords;
  const [endLon, endLat] = endCoords;

  // OSRM requires coordinate parameter order: {lon},{lat};{lon},{lat}
  const url = `https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=full&geometries=geojson`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`OSRM routing service returned status code ${response.status}`);
    }

    const data = await response.json();
    
    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      throw new Error('No routing path could be found between these locations.');
    }

    const route = data.routes[0];
    if (!route.geometry) {
      throw new Error('OSRM response missing geometry coordinates.');
    }

    return {
      geometry: route.geometry,
      distance: route.distance, // in meters
      duration: route.duration   // in seconds
    };
  } catch (error) {
    console.error('Routing Service Failure (OSRM):', error.message);
    throw new Error(error.message || 'Failed to calculate route directions.');
  }
};
