import { useState, useEffect } from "react";

const URL = 'https://api.aviationstack.com/v1/flights?access_key=f0324c0ca8d6f1d762b78f2a88221e45';

function App() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  


  useEffect(() => {
    async function fetchFlights() {
      try {

        // TODO: 1. build the URL using import.meta.env.VITE_AVIATIONSTACK_KEY
        // const url = `${URL}&access_key=${import.meta.env.VITE_AVIATIONSTACK_KEY}`;
        // TODO: 2. await fetch(url)
        const response = await fetch(URL);
        // TODO: 3. await response.json()
        const data = await response.json();
        // TODO: 4. setFlights(...) — look at the JSON shape, where do the actual flight objects live?
        setFlights(data.data);
        console.log(data.data);
      } catch (err) {
        // TODO: setError(...)
        setError(err.message);
      } finally {
        // TODO: setLoading(false)
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

          <input
            type="text"
            placeholder="Search by airport name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="scheduled">Scheduled</option>
            <option value="landed">Landed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Flight List Rendering */}
          {filteredFlights.map((flight) => (
            <div key={flight.flight.iata}>
              <p>{flight.airline.name} — Flight {flight.flight.number}</p>
              <p>{flight.departure.iata} → {flight.arrival.iata}</p>
              <p>Status: {flight.flight_status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;