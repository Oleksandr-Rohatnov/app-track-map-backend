const EARTH_RADIUS = 6371;

const generateUniqueId = () => {
  const timestamp = Date.now().toString(36);
  const randomNum = Math.floor(Math.random() * 1000).toString(36);
  return `${timestamp}${randomNum}`.slice(0, 15);
};

const generateTrackers = () => {
  return Array.from({ length: 100 }, (_, i) => ({
    id: i + generateUniqueId(),
    coordinates: [44.38 + Math.random() * (52.38 - 44.38), 22.14 + Math.random() * (40.23 - 22.14)],
    bearing: Math.floor(Math.random() * 360),
    lastUpdate: new Date().toISOString()
  }));
};

const isWithinUkraine = ([lat, lng]) => {
  const minLat = 44.384;
  const maxLat = 52.384;
  const minLng = 22.144;
  const maxLng = 40.223;

  return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
};

const calculateNewCoordinates = (lat, lng, bearing) => {
  const distance = 1;
  const bearingRad = (bearing * Math.PI) / 180;

  const newLat =
    Math.asin(
      Math.sin((lat * Math.PI) / 180) * Math.cos(distance / EARTH_RADIUS) +
        Math.cos((lat * Math.PI) / 180) * Math.sin(distance / EARTH_RADIUS) * Math.cos(bearingRad)
    ) *
    (180 / Math.PI);

  const newLng =
    lng +
    Math.atan2(
      Math.sin(bearingRad) * Math.sin(distance / EARTH_RADIUS) * Math.cos((lat * Math.PI) / 180),
      Math.cos(distance / EARTH_RADIUS) -
        Math.sin((lat * Math.PI) / 180) * Math.sin((newLat * Math.PI) / 180)
    ) *
      (180 / Math.PI);
  return [newLat, newLng];
};

const calculateNewBearing = (bearing) => {
  const change = Math.random() < 0.5 ? 10 : -10;
  let newBearing = bearing + change;

  if (newBearing < 0) {
    newBearing += 360;
  } else if (newBearing >= 360) {
    newBearing -= 360;
  }

  return newBearing;
};

const updateTrackers = (trackers) => {
  return trackers.map((item) => {
    if (Math.random() < 0.003) {
      return undefined;
    } else {
      const [lat, lng] = item.coordinates;
      const newBearing = calculateNewBearing(item.bearing);
      const newCoordinates = calculateNewCoordinates(lat, lng, newBearing);

      if (!isWithinUkraine(newCoordinates)) {
        return undefined;
      }
      return {
        id: item.id,
        coordinates: calculateNewCoordinates(lat, lng, newBearing),
        bearing: newBearing,
        lastUpdate: new Date().toISOString()
      };
    }
  });
};

module.exports = { generateTrackers, updateTrackers };
