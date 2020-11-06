const loadCSV = async (path) => {
  const rawData = await d3.csv(path);
  const data = {};
  rawData.forEach((item) => {
    data[item.ID] = item;
  });
  return data;
};

const loadJSON = async (path) => {
  const data = await d3.json(path);
  return data;
};

const addDataToGeoJSON = async (data, geoData) => {
  geoData.features.forEach((item) => {
    item.properties.metadata = data[item.id];
  });
  return geoData;
};
