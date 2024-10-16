import React, { useState, useEffect } from "react";
import allStations from "../functions/stations";
import axios from "axios";
import PlaceIcon from "@mui/icons-material/Place";
import {
  Container,
  Typography,
  Button,
  TextField,
  Box,
  Autocomplete,
  Paper,
  Divider,
  Stack,
  CircularProgress,
} from "@mui/material";

const url = "https://backend.delhimetrorail.com/api/v2/en/station_route";

const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const milliseconds = String(now.getMilliseconds()).padStart(3, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
};

function RouteFind() {
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeData, setRouteData] = useState(null); // Store complete route data
  const [code, setCode] = useState({ src: "", dest: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (code.src && code.dest) {
        try {
          const res = await axios.get(
            `${url}/${code.src}/${
              code.dest
            }/least-distance/${getCurrentDateTime()}`
          );
          setRouteData(res.data); // Store the full response data
        } catch (err) {
          console.error("Error fetching data:", err);
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [code]);

  const handleFindRoute = () => {
    setRouteData(null); // Clear the route data when the button is clicked
    if (source && destination) {
      setLoading(true);
      setCode({
        src: source.station_code,
        dest: destination.station_code,
      });
    }
  };

  const handleCloseRoute = () => {
    setRouteData(null); // Clear the route data when the button is clicked
    setSource(null); // Reset the source input field
    setDestination(null); // Reset the destination input field
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" align="center" gutterBottom>
          Metro Route Finder
        </Typography>

        <Box my={3}>
          {/* Source Dropdown */}
          <Autocomplete
            options={allStations}
            getOptionLabel={(option) => option.station_name}
            value={source}
            onChange={(event, newValue) => setSource(newValue)}
            fullWidth
            disablePortal
            autoHighlight
            renderInput={(params) => (
              <TextField
                {...params}
                label="Source Station"
                variant="outlined"
                fullWidth
                margin="normal"
              />
            )}
          />

          {/* Destination Dropdown */}
          <Autocomplete
            options={allStations}
            getOptionLabel={(option) => option.station_name}
            value={destination}
            onChange={(event, newValue) => setDestination(newValue)}
            fullWidth
            disablePortal
            autoHighlight
            renderInput={(params) => (
              <TextField
                {...params}
                label="Destination Station"
                variant="outlined"
                fullWidth
                margin="normal"
              />
            )}
          />

          {/* Find Shortest Route Button */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#1976d2",
              color: "white",
              "&:hover": {
                backgroundColor: "#115293",
              },
              mt: 3,
            }}
            onClick={handleFindRoute}
            fullWidth
          >
            Find Shortest Route
          </Button>
        </Box>
      </Box>
      {loading && (
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      )}
      {/* Display Route and Distance */}
      {routeData && (
        <Box
          mt={5}
          sx={{ padding: 2, backgroundColor: "#f5f5f5", borderRadius: 2 }}
        >
          <Typography
            variant="h6"
            mb={2}
            sx={{ fontWeight: "bold", color: "#1976d2" }}
          >
            Route Details:
            <br />
            (Expected Duration: {routeData.total_time})
          </Typography>
          <Stack spacing={2}>
            {routeData.route.map((line, index) => (
              <Paper
                key={index}
                elevation={3}
                sx={{ p: 2, mb: 2, border: "1px solid #1976d2" }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: "black", fontWeight: "bold" }}
                >
                  {index > 0 ? `Change for ${line.line}` : `Take ${line.line}`}
                </Typography>
                <Typography>
                  Start: {line.start}
                  <br />
                  End: {line.end}
                </Typography>
                <Typography>Travel Time: {line.path_time}</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1">Stations:</Typography>
                <Box>
                  {line.path.map((station, i) => (
                    <Typography
                      key={i}
                      mr={1}
                      mb={1}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <PlaceIcon sx={{ color: `${line.line.split(" ")[0]}` }} />{" "}
                      {station.name}
                    </Typography>
                  ))}
                </Box>
              </Paper>
            ))}
          </Stack>
          {routeData.fare && (
            <Typography mt={2} mb={2}>
              Total Fare: ₹{routeData.fare}
            </Typography>
          )}
          {/* Close Button */}
          <Button
            variant="outlined"
            sx={{
              color: "#dc004e",
              borderColor: "#dc004e",
              "&:hover": {
                backgroundColor: "#dc004e",
                color: "white",
              },
            }}
            onClick={handleCloseRoute}
          >
            Close Route
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default RouteFind;
