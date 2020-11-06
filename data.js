const loadCSV = async (path) => {
  const rawData = await d3.csv(path);
  const data = [];
  rawData.forEach((item) => {
    const existingObject = data.find((elem) => {
      return elem.id == item.id;
    });
    if (existingObject) return;
    data.push(item);
  });
  return data;
};

const loadJSON = async (path) => {
  const data = await d3.json(path);
  return data;
};
