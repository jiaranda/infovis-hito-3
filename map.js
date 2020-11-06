const bbox = d3.select("#map-container").node().getBoundingClientRect();
const width = bbox.width;
const height = bbox.height;
const colorPalette = {
  mapFill: "#1D3557",
  mapStroke: "#457B9D",
  dataMin: "#F1FAEE",
  dataMax: "#E63946",
  categoricalDataPalette: d3.schemePastel1,
};

const getProjection = (geoData) => {
  const projection = d3.geoMercator().fitSize([width, height], geoData);
  return projection;
};

const getGeoPaths = (geoData) => {
  const projection = getProjection(geoData);
  const geoPaths = d3.geoPath().projection(projection);
  return geoPaths;
};

const getColorMap = (data, dataColumn, categorical = false) => {
  let colors;
  if (!categorical) {
    const max = d3.max(data, function (d) {
      return d[dataColumn];
    });
    const min = d3.min(data, function (d) {
      return d[dataColumn];
    });
    colors = d3
      .scaleLinear()
      .domain([min, max])
      .range([colorPalette.dataMin, colorPalette.dataMax]);
  } else {
    const domainData = data.map((item) => item[dataColumn]);
    colors = d3
      .scaleOrdinal()
      .domain(domainData)
      .range(colorPalette.categoricalDataPalette);
  }

  return colors;
};

const addMapMarkers = (svg, geoData, data, dataColumn) => {
  const colors = getColorMap(data, dataColumn);
  const projection = getProjection(geoData);

  svg
    .append("g")
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "mapMarkers")
    .attr("transform", function (d) {
      return "translate(" + projection([d.longitude, d.latitude]) + ")";
    })
    .append("circle")
    .attr("r", 0.5)
    .attr("fill", (d) => colors(d[dataColumn]));
};

const createMap = async (geoData, data, dataColumn) => {
  const geoPaths = getGeoPaths(geoData);
  const mapContainer = d3
    .select("#map-container")
    // .style("height", `${height + 100}px`)
    .style("width", `${width}px`);

  const svg = d3
    .select("#map-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  svg
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

  const mapGroup = svg
    .append("g")
    .attr("clip-path", "url(#clip)")
    .attr("id", "mapGroup");

  mapGroup
    .selectAll("path")
    .data(geoData.features)
    .enter()
    .append("path")
    .attr("d", geoPaths)
    .attr("fill", colorPalette.mapFill)
    .attr("opacity", 0.9)
    .attr("stroke", colorPalette.mapStroke)
    .attr("stroke-width", 0.05)
    .attr("name", (d) => {
      return d.properties.comuna;
    });

  // addMapMarkers(mapGroup, geoData, data, dataColumn);

  let zoom = d3
    .zoom()
    .extent([
      [0, 0],
      [width, height],
    ])
    .translateExtent([
      [0, 0],
      [width, height],
    ])
    .scaleExtent([1, 100])
    .on("zoom", (event) => {
      mapGroup.attr("transform", event.transform);
    });

  mapContainer.call(zoom);

  return svg;
};

const updateMarkerColors = (data, newCol, categorical = false) => {
  const colors = getColorMap(data, newCol, categorical);
  d3.selectAll(".mapMarkers")
    .selectAll("circle")
    .attr("fill", (d) => colors(d[newCol]));
};
