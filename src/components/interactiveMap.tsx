import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ReactDOM from 'react-dom';

// Fix default icon issue in Leaflet
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import userIconUrl from 'leaflet/dist/images/marker-icon-2x.png';

const UserIcon = L.icon({
  iconUrl: userIconUrl,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
  iconSize: [25, 41],
  shadowSize: [41, 41],
  className: 'user-marker-icon',
});
const AccidentIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
  iconSize: [25, 41],
  shadowSize: [41, 41],
  className: 'accident-marker-icon',
});
const ConstructionIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
  iconSize: [25, 41],
  shadowSize: [41, 41],
  className: 'construction-marker-icon',
});
const DefaultIncidentIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
  iconSize: [25, 41],
  shadowSize: [41, 41],
  className: 'default-incident-marker-icon',
});
L.Marker.prototype.options.icon = DefaultIncidentIcon;

interface Incident {
  id: string;
  position: [number, number];
  type: string;
  description: string;
  location?: string;
  timestamp: number;
}

interface InteractiveMapProps {
  onIncidentsChange?: (incidents: Incident[]) => void;
}

const defaultIncidents: Incident[] = [
  {
    id: '1',
    position: [37.7749, -122.4194],
    type: 'Accident',
    description: 'Minor collision at Main St & Oak Ave',
    location: 'Main St & Oak Ave, San Francisco',
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
  },
  {
    id: '2',
    position: [37.7799, -122.4294],
    type: 'Construction',
    description: 'Roadwork on Market St',
    location: 'Market St, San Francisco',
    timestamp: Date.now() - 6 * 60 * 60 * 1000,
  },
];

// Helper: Haversine distance in meters
function getDistanceMeters([lat1, lon1]: [number, number], [lat2, lon2]: [number, number]) {
  const R = 6371e3;
  const toRad = (deg: number) => deg * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Helper to create a DivIcon with styled label above the marker
function createLabeledIcon(label: string, iconUrl: string, className: string, type: string) {
  let bg = '#2563eb'; // default blue
  let emoji = '📍';
  if (type.toLowerCase().includes('accident')) { bg = '#dc2626'; emoji = '🚨'; }
  else if (type.toLowerCase().includes('construction')) { bg = '#facc15'; emoji = '🚧'; }
  else if (type === 'You') { bg = '#2563eb'; emoji = '🧑'; }
  else if (type.toLowerCase().includes('hazard')) { bg = '#f59e42'; emoji = '⚠️'; }
  return L.divIcon({
    className: '',
    html: `<div style="display: flex; flex-direction: column; align-items: center;">
      <span style="
        font-weight: bold;
        font-size: 14px;
        color: #fff;
        background: ${bg};
        padding: 2px 10px 2px 8px;
        border-radius: 8px;
        margin-bottom: 2px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.18);
        display: inline-flex;
        align-items: center;
        gap: 4px;
        transition: transform 0.15s;
        user-select: none;
      " class='marker-label'>${emoji} <span>${label}</span></span>
      <img src='${iconUrl}' class='${className}' style='width:25px;height:41px;display:block;' />
    </div>`
  });
}

// Helper component to update map view on center change
const SetViewOnCenter: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

// Pulsing effect for nearby incidents
const PulsingEffect: React.FC = () => (
  <div style={{
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 40,
    height: 40,
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    zIndex: 1,
  }}>
    <div className="animate-pulse rounded-full bg-red-400 opacity-40 w-full h-full"></div>
  </div>
);

const InteractiveMap = forwardRef<any, InteractiveMapProps>(({ onIncidentsChange }, ref) => {
  const [incidents, setIncidents] = useState<Incident[]>(defaultIncidents);
  const [form, setForm] = useState({ type: '', description: '', location: '' });
  const [showModal, setShowModal] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([37.7749, -122.4194]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geoError, setGeoError] = useState('');

  // Geolocation effect
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setMapCenter(coords);
          setUserLocation(coords);
        },
        () => {},
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  // Expose openReportModal to parent
  useImperativeHandle(ref, () => ({
    openReportModal: () => setShowModal(true)
  }));

  // Notify parent of incident changes
  useEffect(() => {
    if (onIncidentsChange) onIncidentsChange(incidents);
  }, [incidents, onIncidentsChange]);

  // Geocode address to [lat, lng]
  async function geocodeAddress(address: string): Promise<[number, number] | null> {
    try {
      setIsGeocoding(true);
      setGeoError('');
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      } else {
        setGeoError('Location not found.');
        return null;
      }
    } catch {
      setGeoError('Error looking up location.');
      return null;
    } finally {
      setIsGeocoding(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let pos: [number, number] | null = null;
    if (form.location.trim()) {
      pos = await geocodeAddress(form.location.trim());
      if (!pos) return;
    } else {
      pos = userLocation || mapCenter;
    }
    setIncidents([
      ...incidents,
      {
        id: Date.now().toString(),
        position: pos,
        type: form.type,
        description: form.description,
        location: form.location,
        timestamp: Date.now(),
      },
    ]);
    setShowModal(false);
    setForm({ type: '', description: '', location: '' });
    setGeoError('');
  };

  // Modal JSX (portal)
  const modal = showModal && ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4">Report Incident</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <input
              type="text"
              required
              value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g. Accident, Hazard, Construction"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              required
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full border rounded px-3 py-2"
              placeholder="Describe the incident"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location (optional)</label>
            <input
              type="text"
              value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter address or place"
            />
          </div>
          {geoError && <div className="text-red-600 text-sm">{geoError}</div>}
          <div className="flex gap-2 mt-4">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700" disabled={isGeocoding}>{isGeocoding ? 'Locating...' : 'Submit'}</button>
            <button type="button" className="flex-1 bg-gray-300 py-2 rounded" onClick={() => { setShowModal(false); setGeoError(''); }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );

  // Determine if incident is near user (within 1km)
  function isNearMe(pos: [number, number]) {
    if (!userLocation) return false;
    return getDistanceMeters(pos, userLocation) <= 1000;
  }

  return (
    <>
      <div className="w-full h-96 relative z-10">
        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
          <SetViewOnCenter center={mapCenter} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* User location marker */}
          {userLocation && (
            <Marker position={userLocation} icon={createLabeledIcon('You', userIconUrl, 'user-marker-icon', 'You')}>
              <Popup>Your Location</Popup>
            </Marker>
          )}
          {incidents.map((incident) => {
            let icon = createLabeledIcon(incident.type, iconUrl, 'incident-marker-icon', incident.type);
            if (incident.type.toLowerCase().includes('accident')) icon = createLabeledIcon(incident.type, iconUrl, 'accident-marker-icon', incident.type);
            else if (incident.type.toLowerCase().includes('construction')) icon = createLabeledIcon(incident.type, iconUrl, 'construction-marker-icon', incident.type);
            else if (incident.type.toLowerCase().includes('hazard')) icon = createLabeledIcon(incident.type, iconUrl, 'hazard-marker-icon', incident.type);
            return (
              <React.Fragment key={incident.id}>
                {isNearMe(incident.position) && (
                  <PulsingEffect />
                )}
                <Marker position={incident.position} icon={icon}>
                  <Popup>
                    <div>
                      <strong>{incident.type}</strong>
                      <p>{incident.description}</p>
                      {incident.location && <div className="text-xs text-gray-500">{incident.location}</div>}
                      {isNearMe(incident.position) && <div className="text-red-600 font-bold">ALERT: Near You</div>}
                      <small>{new Date(incident.timestamp).toLocaleString()}</small>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}
        </MapContainer>
      </div>
      {modal}
    </>
  );
});

export default InteractiveMap; 