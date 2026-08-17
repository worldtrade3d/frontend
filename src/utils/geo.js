import { geoArea } from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function getISO(f) {
  return f.properties.ISO_A3 !== "-99"
    ? f.properties.ISO_A3
    : f.properties.ADM0_A3;
}

const landmassCache = new WeakMap();

export function getMainLandmass(feature) {
  
  if (landmassCache.has(feature)) {
    return landmassCache.get(feature);
  }
  
  if (feature.geometry.type !== "MultiPolygon") {
    landmassCache.set(feature, feature);
    return feature;
  }

  let largestPolygon = null;
  let largestArea = 0;

  for (const polygon of feature.geometry.coordinates) {
    const testFeature = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: polygon
      }
    };

    const area = geoArea(testFeature);

    if (area > largestArea) {
      largestArea = area;
      largestPolygon = polygon;
    }
  }

  if (!largestPolygon) {
    landmassCache.set(feature, feature);
    return feature;
  }

  const result = {
    type: "Feature",
    properties: feature.properties,
    geometry: {
      type: "Polygon",
      coordinates: largestPolygon
    }
  };

  landmassCache.set(feature, result);

  return result;
}