import { Link } from 'react-router-dom';

// The same sidebar shows on both the dashboard and the detail view.
// Because App renders it outside <Routes>, it never unmounts when the route changes.
function Sidebar({ totalFlights }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-logo">✈</span>
        <div>
          <h1 className="sidebar-title">SKYBOARD</h1>
          <p className="sidebar-sub">Live Departures</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {/* Link back to the dashboard from anywhere */}
        <Link to="/" className="sidebar-link">
          Dashboard
        </Link>
      </nav>

      <div className="sidebar-footer">
        <p className="sidebar-count">{totalFlights}</p>
        <p className="sidebar-count-label">flights tracked</p>
      </div>
    </aside>
  );
}

export default Sidebar;