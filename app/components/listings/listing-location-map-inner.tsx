// components/listings/listing-location-map-inner.tsx
"use client";

import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import L from "leaflet";

type ListingLocationMapInnerProps = {
  latitude: number | string;
  longitude: number | string;
  address?: string | null;
};

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function ListingLocationMapInner({
  latitude,
  longitude,
  address,
}: ListingLocationMapInnerProps) {
  const lat = Number(latitude);
  const lng = Number(longitude);

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200">
      <MapContainer
        center={[lat, lng]}
        zoom={16}
        scrollWheelZoom={false}
        style={{ height: "320px", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors &copy; CARTO"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <Marker position={[lat, lng]} icon={markerIcon}>
          {address ? <Popup>{address}</Popup> : null}
        </Marker>
      </MapContainer>
    </div>
  );
}
