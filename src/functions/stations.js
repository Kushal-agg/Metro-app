import blue from "./lines/blue.json";
import bluebranch from "./lines/bluebranch.json";
import magenta from "./lines/magenta.json";
import yellow from "./lines/yellow.json";
import violet from "./lines/violet.json";
import red from "./lines/red.json";
import green from "./lines/green.json";
import pink from "./lines/pink.json";
import orange from "./lines/orange.json";
import grey from "./lines/grey.json";
import rapid from "./lines/rapid.json";

const extractStationDetails = (lineData) => {
  return lineData.map((station) => ({
    station_name: station["station_name"],
    station_code: station["station_code"],
  }));
};

const blueStations = extractStationDetails(blue);
const bluebranchStations = extractStationDetails(bluebranch);
const magentaStations = extractStationDetails(magenta);
const yellowStations = extractStationDetails(yellow);
const violetStations = extractStationDetails(violet);
const redStations = extractStationDetails(red);
const greenStations = extractStationDetails(green);
const pinkStations = extractStationDetails(pink);
const orangeStations = extractStationDetails(orange);
const greyStations = extractStationDetails(grey);
const rapidStations = extractStationDetails(rapid);

// Combine all station details into a single array
const allStations = [
  ...blueStations,
  ...bluebranchStations,
  ...magentaStations,
  ...yellowStations,
  ...violetStations,
  ...redStations,
  ...greenStations,
  ...pinkStations,
  ...orangeStations,
  ...greyStations,
  ...rapidStations,
];

// Remove duplicates and sort by station name
const uniqueStations = [
  ...new Map(allStations.map((item) => [item.station_code, item])).values(),
].sort((a, b) => a.station_name.localeCompare(b.station_name));

console.log(uniqueStations);
export default uniqueStations;
