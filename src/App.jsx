import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FlightDetail from './components/FlightDetail';
import './App.css';

// import mockData from './mockFlight.json'; // fallback if the API quota is maxed out

const URL = 'https://api.aviationstack.com/v1/flights?access_key=f0324c0ca8d6f1d762b78f2a88221e45';
// const BASE_URL = 'https://api.aviationstack.com/v1/flights';

function App() {
  // State lives HERE (the parent) so both Dashboard and FlightDetail can share it.
  // Aviationstack has no "get flight by id" endpoint, so we fetch the whole list
  // once and let the detail view pluck out its flight by index.
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFlights() {
      try {
        // const url = `${BASE_URL}?access_key=${import.meta.env.VITE_AVIATIONSTACK_KEY}`;
        // const response = await fetch(url);
        const response = await fetch(URL);
        const data = await response.json();

        // ===== TEMP: using local mock data instead =====
        // const data = mockData;


        // ===== Quota-exhausted fallback: comment out the two lines above =====
        // ===== and uncomment the line below to run off local mock data.  =====
        // const data = mockData;

        if (!data.data) {
          throw new Error('No flight data available');
        }

        // Give every flight a stable, unique id (its position in the array).
        // This becomes the value in each detail URL: /flights/0, /flights/1, ...
        const withIds = data.data.map((flight, index) => ({ ...flight, id: index }));

        setFlights(withIds);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFlights();
  }, []); // empty array = run once on mount

  return (
    <div className="app-layout">
      {/* Sidebar is rendered OUTSIDE <Routes>, so it stays visible on every page */}
      <Sidebar totalFlights={flights.length} />

      <main className="app-main">
        {loading && <p className="status-msg">Loading flights…</p>}
        {error && <p className="status-msg error">Error: {error}</p>}

        {!loading && !error && (
          <Routes>
            {/* Dashboard view */}
            <Route path="/" element={<Dashboard flights={flights} />} />
            {/* Detail view — :id is read inside FlightDetail with useParams() */}
            <Route path="/flights/:id" element={<FlightDetail flights={flights} />} />
          </Routes>
        )}
      </main>
    </div>
  );
}

export default App;