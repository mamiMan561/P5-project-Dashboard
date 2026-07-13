import { useParams, Link } from 'react-router-dom';
import { formatTime } from '../utils';

function FlightDetail({ flights }) {
  // useParams() reads the dynamic part of the URL. For /flights/5 it returns { id: "5" }.
  // URL params are always strings, so convert to a number to match our flight ids.
  const { id } = useParams();
  const flight = flights.find((f) => f.id === Number(id));

  // Graceful handling if someone hits a bad URL or the data hasn't loaded.
  if (!flight) {
    return (
      <div className="detail">
        <p className="status-msg">Flight not found.</p>
        <Link to="/" className="back-link">← Back to dashboard</Link>
      </div>
    );
  }

  const { departure, arrival, airline, flight: flightInfo, aircraft } = flight;

  return (
    <div className="detail">
      <Link to="/" className="back-link">← Back to dashboard</Link>

      <header className="detail-header">
        <div>
          <p className="detail-eyebrow">{airline?.name ?? 'Unknown airline'}</p>
          <h2 className="detail-flight-code mono">{flightInfo?.iata ?? '—'}</h2>
        </div>
        <span className={`badge badge-${flight.flight_status} badge-lg`}>
          {flight.flight_status}
        </span>
      </header>

      {/* Route summary */}
      <div className="detail-route">
        <div className="route-endpoint">
          <p className="route-iata mono">{departure?.iata ?? '—'}</p>
          <p className="route-airport">{departure?.airport ?? 'Unknown'}</p>
          <p className="route-time mono">{formatTime(departure?.scheduled)}</p>
        </div>
        <div className="route-arrow">✈</div>
        <div className="route-endpoint">
          <p className="route-iata mono">{arrival?.iata ?? '—'}</p>
          <p className="route-airport">{arrival?.airport ?? 'Unknown'}</p>
          <p className="route-time mono">{formatTime(arrival?.scheduled)}</p>
        </div>
      </div>

      {/* Extra detail NOT shown on the dashboard */}
      <div className="detail-grid">
        <DetailField label="Flight date" value={flight.flight_date} />
        <DetailField label="Airline IATA / ICAO" value={`${airline?.iata ?? '—'} / ${airline?.icao ?? '—'}`} />
        <DetailField label="Flight number" value={flightInfo?.number} />
        <DetailField label="Flight ICAO" value={flightInfo?.icao} />

        <DetailField label="Departure terminal" value={departure?.terminal} />
        <DetailField label="Departure gate" value={departure?.gate} />
        <DetailField label="Departure timezone" value={departure?.timezone} />
        <DetailField label="Departure delay" value={departure?.delay != null ? `${departure.delay} min` : null} />

        <DetailField label="Arrival terminal" value={arrival?.terminal} />
        <DetailField label="Arrival gate" value={arrival?.gate} />
        <DetailField label="Arrival baggage" value={arrival?.baggage} />
        <DetailField label="Arrival delay" value={arrival?.delay != null ? `${arrival.delay} min` : null} />

        <DetailField label="Estimated departure" value={formatTime(departure?.estimated)} />
        <DetailField label="Estimated arrival" value={formatTime(arrival?.estimated)} />
        <DetailField label="Aircraft ICAO24" value={aircraft?.icao24} />
        <DetailField
          label="Codeshare"
          value={flightInfo?.codeshared?.airline_name
            ? `${flightInfo.codeshared.airline_name} ${flightInfo.codeshared.flight_iata}`
            : null}
        />
      </div>
    </div>
  );
}

// Small reusable field. Shows "—" whenever the API returned null (very common here).
function DetailField({ label, value }) {
  return (
    <div className="detail-field">
      <p className="detail-field-label">{label}</p>
      <p className="detail-field-value">{value ?? '—'}</p>
    </div>
  );
}

export default FlightDetail;