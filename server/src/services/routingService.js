/**
 * OSRM (Open Source Routing Machine) Routing Service Placeholder
 * Future phases will use this to draw route lines from user geolocations to shops.
 */

const getRoute = async (startCoords, endCoords) => {
  // Placeholder OSRM driving route API integration
  // Standard OSRM format: http://router.project-osrm.org/route/v1/driving/{start_lon},{start_lat};{end_lon},{end_lat}
  
  console.log('OSRM routing query placeholder invoked for:', { startCoords, endCoords });
  throw new Error('Routing service (OSRM) is not implemented yet.');
};

module.exports = {
  getRoute
};
