/**
 * Nominatim (OpenStreetMap) Geocoding Service
 * Converts addresses into geographic coordinates using the free Nominatim Search API.
 */

const geocodeAddress = async (address) => {
  if (!address || address.trim() === '') {
    throw new Error('Address query cannot be empty.');
  }

  // 1. Compile progressive search query variations to try
  const queriesToTry = [address.trim()];

  if (address.includes(',')) {
    const segments = address.split(',').map(s => s.trim());

    // Variation A: Remove the first segment (frequently house/plot numbers like 'E 514')
    if (segments.length > 1) {
      queriesToTry.push(segments.slice(1).join(', '));
      
      // Variation B: Road + City (second segment + second-to-last segment)
      const road = segments[1];
      const city = segments[segments.length - 2] || segments[segments.length - 1];
      if (road && road.trim() !== '' && city && city.trim() !== '') {
        queriesToTry.push(`${road}, ${city}`);
      }
    }
  }

  // Deduplicate variations to maximize speed
  const uniqueQueries = [...new Set(queriesToTry)];

  // 2. Query variations progressively until a result is found
  for (const query of uniqueQueries) {
    if (!query || query.trim() === '') continue;
    
    const encodedAddress = encodeURIComponent(query);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1&countrycodes=in`;

    // Strict 2-second timeout per fetch request using AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'ChaiSpotApp/1.0 (contact: info@chaispot.local; user: abhavkushwaha)'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) continue;

      const data = await response.json();
      if (data && data.length > 0) {
        const result = data[0];
        const latitude = parseFloat(result.lat);
        const longitude = parseFloat(result.lon);

        if (!isNaN(latitude) && !isNaN(longitude)) {
          console.log(`Geocoding success using query variation: "${query}"`);
          return {
            latitude,
            longitude,
            placeName: result.display_name || query
          };
        }
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.warn(`Query variation "${query}" failed or timed out:`, error.message);
    }
  }

  // 3. Fallback on complete lookup failure
  const err = new Error('Address could not be located.');
  err.statusCode = 400;
  throw err;
};

module.exports = {
  geocodeAddress
};
