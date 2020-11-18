const changeColSelector = async (col) => {
  const listingsData = await loadCSV("data/listings.csv");
  if (col == "price") {
    updateMarkerColors(listingsData, "price");
    d3.select("#price-button").attr("class", "selected");
    d3.select("#reviews-button").attr("class", "notSelected");
    d3.select("#roomType-button").attr("class", "notSelected");
  } else if (col == "reviews") {
    updateMarkerColors(listingsData, "number_of_reviews");
    d3.select("#price-button").attr("class", "notSelected");
    d3.select("#reviews-button").attr("class", "selected");
    d3.select("#roomType-button").attr("class", "notSelected");
  } else if (col == "roomType") {
    updateMarkerColors(listingsData, "room_type", true);
    d3.select("#price-button").attr("class", "notSelected");
    d3.select("#reviews-button").attr("class", "notSelected");
    d3.select("#roomType-button").attr("class", "selected");
  }
};

const main = async () => {
  const censoData = await loadCSV("data/censo.csv");
  const citiesData = await loadJSON("data/comunas.geojson");

  await addDataToGeoJSON(censoData, citiesData);

  const mapSVG = await createMap(citiesData, "TOTAL_PERS");
};

main();
