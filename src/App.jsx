import { useState, useEffect } from "react";
import mockData from "./mockFlight.json"; // TEMP: local data while API quota is maxed out
import './App.css';

//const URL = 'https://api.aviationstack.com/v1/flights?access_key=f0324c0ca8d6f1d762b78f2a88221e45';

function App() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function fetchFlights() {
      try {
        // ===== REAL API CALL — commented out until monthly quota resets =====
        // const url = `${URL}&access_key=${import.meta.env.VITE_AVIATIONSTACK_KEY}`;
        // const response = await fetch(url);
        // const data = await response.json();

        // ===== TEMP: using local mock data instead =====
        const data = mockData;

        if (!data.data) {
          throw new Error('No flight data available');
        }

        setFlights(data.data);
        console.log(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFlights();
  }, []); // empty array = run once on mount

  const totalFlights = flights.length;
  const activeCount = flights.filter(flight => flight.flight_status === 'active').length;
  const scheduledCount = flights.filter(flight => flight.flight_status === 'scheduled').length;

  const delayedFlights = flights.filter(flight => flight.departure.delay !== null);
  const totalDelay = delayedFlights.reduce((sum, flight) => {
    return sum + flight.departure.delay;
  }, 0);

  const avgDelay = delayedFlights.length > 0 ? totalDelay / delayedFlights.length : 0;

  const filteredFlights = flights.filter(flight => {
    const matchesSearch =
      flight.departure.airport?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flight.arrival.airport?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || flight.flight_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  function formatTime(isoString) {
    if (!isoString) return '—';
    const d = new Date(isoString);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${mm}-${dd} ${hh}:${min}`;
  }

  return (
    <div>
      {loading && <p>Loading flights...</p>}
      {error && <p>Error: {error}</p>}

      {!loading && !error && (
        <div>
          {/* Flight Stats Summary */}
          <div className="stats">
            <div className="stat-card">
              <p>Total Flights </p>
              <p>{totalFlights}</p>
            </div>
            <div className="stat-card">
              <p>Active Flights</p>
              <p>{activeCount}</p>
            </div>
            <div className="stat-card">
              <p>Active vs Scheduled</p>
              <p>{activeCount} / {scheduledCount}</p>
            </div>
            <div className="stat-card">
              <p>Average Delay</p>
              <p>{avgDelay.toFixed(2)} minutes</p>
            </div>
          </div>

          <div className="controls">
            <input
              type="text"
              placeholder="Search by airport (e.g. Hong Kong)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="scheduled">Scheduled</option>
              <option value="landed">Landed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Flight List Table */}
          <div className="flight-table">
            <div className="flight-row flight-header">
              <span>Airline</span>
              <span>Flight</span>
              <span>Route</span>
              <span>Scheduled</span>
              <span>Status</span>
            </div>

            {filteredFlights.map((flight) => (
              <div
                className="flight-row"
                key={flight.flight.iata ?? `${flight.departure.iata}-${flight.arrival.iata}-${flight.departure.scheduled}`}
              >
                <span>{flight.airline.name}</span>
                <span>{flight.flight.iata}</span>
                <span className="route">{flight.departure.iata} → {flight.arrival.iata}</span>
                <span>{formatTime(flight.departure.scheduled)}</span>
                <span>
                  <span className={`badge badge-${flight.flight_status}`}>
                    {flight.flight_status}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;