import React, { useState, useEffect } from "react";
import Grid from "./Components/Grid/Grid";
import PhotoDetails from "./Components/PhotoDetails/PhotoDetails";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import conf from "./conf/conf";
import { TextField, Select, MenuItem, CircularProgress, Container, Typography, Box, Switch, CssBaseline, createTheme, ThemeProvider, FormControlLabel } from '@mui/material';

const API_KEY = conf.pexelsApiKey;
const API_URL = conf.pexelsUrl;

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [numPhotos, setNumPhotos] = useState(() => {
    const savedLayout = localStorage.getItem("gridLayout");
    return savedLayout ? parseInt(savedLayout, 10) : 3; 
  });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const fetchPhotos = async () => {
    if (!searchTerm) return;

    setLoading(true);
    setError(null); 
    try {
      const response = await fetch(`${API_URL}?query=${searchTerm}&per_page=${numPhotos}`, {
        headers: {
          Authorization: API_KEY,
        },
      });

      const data = await response.json();

      if (data.photos && data.photos.length > 0) {
        setPhotos(data.photos);
      } else {
        setPhotos([]);
        setError(`No photos found for "${searchTerm}".`);
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
      setError("An error occurred while fetching photos. Please try again.");
    }
    setLoading(false);
  };

  const debouncedFetchPhotos = debounce(fetchPhotos, 500);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDropdownChange = (e) => {
    const selectedValue = parseInt(e.target.value, 10);
    setNumPhotos(selectedValue);
    localStorage.setItem("gridLayout", selectedValue);
  };

  const handleDarkModeChange = (e) => {
    setDarkMode(e.target.checked);
  };

  useEffect(() => {
    if (searchTerm) {
      debouncedFetchPhotos();
    }
  }, [searchTerm, numPhotos]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="min-h-screen">
          <header className="flex justify-between items-center p-6 bg-blue-600 text-white shadow-md">
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Photo Gallery
              </Typography>
              <Typography variant="body2" mt={2}>
                Discover stunning images powered by Pexels
              </Typography>
            </Box>
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={handleDarkModeChange}
                    color="default"
                    inputProps={{ 'aria-label': 'Dark Mode Toggle' }}
                  />
                }
                label={darkMode ? "Light Mode" : "Dark Mode"}  
                labelPlacement="start"
              />
            </Box>
          </header>

          <Routes>
            <Route
              path="/"
              element={
                <Container maxWidth="lg">
                  <Box display="flex" flexDirection="column" gap={2} my={4} alignItems="center">
                    <TextField
                      label="Search for Photos"
                      variant="outlined"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      fullWidth
                      sx={{ maxWidth: 400 }}
                    />
                    <Select
                      value={numPhotos}
                      onChange={handleDropdownChange}
                      fullWidth
                      sx={{ maxWidth: 400 }}
                      variant="outlined"
                    >
                      <MenuItem value={2}>2 Columns</MenuItem>
                      <MenuItem value={3}>3 Columns</MenuItem>
                      <MenuItem value={4}>4 Columns</MenuItem>
                      <MenuItem value={5}>5 Columns</MenuItem>
                      <MenuItem value={6}>6 Columns</MenuItem>
                    </Select>
                  </Box>

                  <main>
                    {loading && (
                      <Box display="flex" justifyContent="center" mt={4}>
                        <CircularProgress color="primary" />
                      </Box>
                    )}
                    {error && (
                      <Box textAlign="center" mt={4}>
                        <Typography color="error" variant="h6">
                          {error}
                        </Typography>
                      </Box>
                    )}
                    {!error && <Grid photos={photos} loading={loading} numPhotos={numPhotos} />}
                  </main>
                </Container>
              }
            />

            <Route path="/photo/:id" element={<PhotoDetails photoData={photos} />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
