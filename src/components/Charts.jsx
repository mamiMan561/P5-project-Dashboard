import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

// Departure-board palette for the chart segments
const STATUS_COLORS = {
  active: '#4ade80',
  scheduled: '#60a5fa',
  landed: '#fbbf24',
  cancelled: '#f87171',
  incident: '#c084fc',
  diverted: '#22d3ee',
};
const FALLBACK = '#9ca3af';

// ---------- CHART 1: flight status breakdown (operational state) ----------
function StatusChart({ flights }) {
  // Count how many flights fall into each status.
  const counts = {};
  flights.forEach((flight) => {
    const status = flight.flight_status || 'unknown';
    counts[status] = (counts[status] || 0) + 1;
  });

  // Recharts wants an array of { name, value } objects.
  const data = Object.entries(counts).map(([name, value]) => ({ name, value }));

  return (
    <div className="chart-card">
      <h3 className="chart-title">Flights by Status</h3>
      <p className="chart-caption">How the tracked flights break down operationally</p>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || FALLBACK} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#242424', border: '1px solid #333333', color: '#f5f5f5' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// ---------- CHART 2: busiest departure airports (geography) ----------
function TopAirportsChart({ flights }) {
  // Count flights per departure airport.
  const counts = {};
  flights.forEach((flight) => {
    const airport = flight.departure?.iata;
    if (!airport) return; // skip null-safe
    counts[airport] = (counts[airport] || 0) + 1;
  });

  // Sort descending and keep the top 6 busiest airports.
  const data = Object.entries(counts)
    .map(([airport, count]) => ({ airport, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return (
    <div className="chart-card">
      <h3 className="chart-title">Busiest Departure Airports</h3>
      <p className="chart-caption">Top 6 origins by number of departures</p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="airport" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} />
          <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} allowDecimals={false} />
          <Tooltip
            cursor={{ fill: 'rgba(59,130,246,0.10)' }}
            contentStyle={{ background: '#242424', border: '1px solid #333333', color: '#f5f5f5' }}
          />
          <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Render both side by side
function Charts({ flights }) {
  return (
    <div className="charts-grid">
      <StatusChart flights={flights} />
      <TopAirportsChart flights={flights} />
    </div>
  );
}

export default Charts;