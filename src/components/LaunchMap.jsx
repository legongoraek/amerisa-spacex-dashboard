import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const LaunchMap = ({ launch }) => {
  if (!launch?.launchpad_location) return null;

  const latitude = launch.launchpad_location.latitude;
  const longitude = launch.launchpad_location.longitude;

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  const position = [latitude, longitude];

  return (
    <div className="map-wrap">
      <MapContainer
        center={position}
        zoom={10}
        scrollWheelZoom={false}
        className="launch-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={position}>
          <Popup>
            <strong>{launch.name}</strong>
            <br />
            {launch.launchpad_name}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LaunchMap;