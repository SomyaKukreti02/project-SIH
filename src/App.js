// App.js

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import './App.css';

const App = () => {
  const [userInput, setUserInput] = useState('');
  const [extractedPlaces, setExtractedPlaces] = useState([]);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState(5);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleExtractPlaces = async () => {
    // Prerequisite: Create tables of canonical names for countries, cities, and states
    const countryTable = ['India', 'United States', 'United Kingdom']; // Add more countries
    const cityTable = ['Mumbai', 'Ahmedabad', 'Chennai']; // Add more cities
    const stateTable = ['Maharashtra', 'Gujarat', 'Tamil Nadu']; // Add more states

    // Tokenize the input statement using a simple split
    const tokens = userInput.split(/\s+/);

    // Initialize the array to store extracted places
    const extracted = [];

    // Iterate through the tokens and match them with canonical names
    tokens.forEach((token) => {
      // Fuzzy match for countries
      const matchedCountry = countryTable.find(
        (country) => token.toLowerCase() === country.toLowerCase()
      );
      if (matchedCountry) {
        extracted.push({ token, canonicalName: matchedCountry, type: 'Country' });
        return;
      }

      // Fuzzy match for cities
      const matchedCity = cityTable.find(
        (city) => token.toLowerCase() === city.toLowerCase()
      );
      if (matchedCity) {
        extracted.push({ token, canonicalName: matchedCity, type: 'City' });
        return;
      }

      // Fuzzy match for states
      const matchedState = stateTable.find(
        (state) => token.toLowerCase() === state.toLowerCase()
      );
      if (matchedState) {
        extracted.push({ token, canonicalName: matchedState, type: 'State' });
      }
    });

    // Update the state with the extracted places
    setExtractedPlaces(extracted);

    // Zoom to the first extracted place if available
    if (extracted.length > 0) {
      try {
        // Use a geocoding service to get precise coordinates for the first place
        const firstPlace = extracted[0];
        const coordinates = await getCoordinatesForPlace(firstPlace.canonicalName);

        setMapCenter(coordinates);
        setMapZoom(10); // You can adjust the zoom level as needed
      } catch (error) {
        console.error('Error getting coordinates:', error);
      }
    }
  };

  const getCoordinatesForPlace = async (placeName) => {
    // In a real-world scenario, you would use a geocoding service API to get coordinates
    // For now, return a placeholder coordinates array
    return [20.5937, 78.9629];
  };

  useEffect(() => {
    // Additional logic or side effects can be added here
  }, [userInput, extractedPlaces]);

  return (
    <div className="App-container">
      <h1>Geospatial Query System</h1>
      <form>
        <label>
          Enter your Query?:
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
          />
        </label>
        <button type="button" onClick={handleExtractPlaces}>
          Extract Places
        </button>
      </form>
      {extractedPlaces.length > 0 && (
        <div className="Output-container">
          <h2>Extracted Places:</h2>
          <ul>
            {extractedPlaces.map((place, index) => (
              <li key={index}>
                {place.token} (Canonical Name: {place.canonicalName}, Type: {place.type})
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="Map-container">
        <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '400px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {extractedPlaces.map((place, index) => (
            <Marker key={index} position={[/* You need to add coordinates for each place */]}>
              <Popup>{place.canonicalName}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      {/* Additional JSX Content */}
      <div className="Additional-Content">
        <h2>Additional Content</h2>
        <p>This is some additional content you can customize.</p>
      </div>
    </div>
  );
};

export default App;
