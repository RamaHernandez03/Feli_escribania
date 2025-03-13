import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41], // Tamaño del ícono
  iconAnchor: [12, 41], // Punto de anclaje
  popupAnchor: [1, -34], // Anclaje del popup
});

const Mapa = () => {
  return (
    <MapContainer center={[-34.6037, -58.3816]} zoom={13} style={{ height: "450px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[-34.6037, -58.3816]} icon={customIcon}>
        <Popup>Direccion 123, Buenos Aires, Argentina</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Mapa;

