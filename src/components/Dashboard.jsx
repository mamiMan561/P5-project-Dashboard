import { useState } from 'react';
import { Link } from 'react-router-dom';
import Charts from './Charts';
import { formatTime } from '../utils';

function Dashboard({ flights }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // ---- Summary statistics ----
  const totalFlights = flights.length;
  const activeCount = flights.filter((f) => f.flight_status === 'active').length;
  const scheduledCount = flights.filter((f) => f.flight_status === 'scheduled').length;

  const delayedFlights = flights.filter((f) => f.departure?.delay !== null && f.departure?.delay !== undefined);
  const totalDelay = delayedFlights.reduce((sum, f) => sum + f.departure.delay, 0);
  const avgDelay = delayedFlights.length > 0 ? totalDelay / delayedFlights.length : 0;

  // ---- Search + category filter (combined with &&) ----
  const filteredFlights = flights.filter((flight) => {
    const matchesSearch =
      flight.departure?.airport?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flight.arrival?.airport?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || flight.flight_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="dashboard">
      <header className="page-header">
        <h2 className="page-title">Departure Board</h2>
        <p className="page-subtitle">{filteredFlights.length} of {totalFlights} flights shown</p>
      </header>

      {/* Stats */}
      <div className="stats">
        <div className="stat-card">
          <p className="stat-label">Total Flights</p>
          <p className="stat-value">{totalFlights}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Active</p>
          <p className="stat-value">{activeCount}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Active / Scheduled</p>
          <p className="stat-value">{activeCount} / {scheduledCount}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Avg Delay</p>
          <p className="stat-value">{avgDelay.toFixed(1)}<span className="stat-unit"> min</span></p>
        </div>
      </div>

      {/* Two charts */}
      <Charts flights={flights} />

      {/* Controls */}
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

      {/* Flight list — each row links to that flight's unique detail page */}
      <div className="flight-table">
        <div className="flight-row flight-header">
          <span>Airline</span>
          <span>Flight</span>
          <span>Route</span>
          <span>Scheduled</span>
          <span>Status</span>
        </div>

        {filteredFlights.map((flight) => (
          <Link
            key={flight.id}
            to={`/flights/${flight.id}`}
            className="flight-row flight-link"
          >
            <span>{flight.airline?.name ?? '—'}</span>
            <span className="mono">{flight.flight?.iata ?? '—'}</span>
            <span className="route mono">
              {flight.departure?.iata} → {flight.arrival?.iata}
            </span>
            <span className="mono">{formatTime(flight.departure?.scheduled)}</span>
            <span>
              <span className={`badge badge-${flight.flight_status}`}>
                {flight.flight_status}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;