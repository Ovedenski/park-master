"use client";

import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

type MapPosition = {
  lat: number;
  lng: number;
};

type MapPickerProps = {
  position: MapPosition | null;
  onChange: (lat: number, lng: number) => void;
};

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const defaultPosition = {
  lat: 42.6977,
  lng: 23.3219,
};

function MapClickHandler({
  onChange,
}: {
  onChange: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(event) {
      onChange(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

function RecenterMap({ position }: { position: MapPosition | null }) {
  const map = useMap();

  useEffect(() => {
    if (!position) return;

    map.setView([position.lat, position.lng], 16);
  }, [map, position]);

  return null;
}

export default function MapPicker({ position, onChange }: MapPickerProps) {
  const center = position ?? defaultPosition;

  return (
    <div className="overflow-hidden rounded-lg border">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={position ? 16 : 12}
        scrollWheelZoom={false}
        style={{ height: "288px", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors &copy; CARTO"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <RecenterMap position={position} />
        <MapClickHandler onChange={onChange} />

        {position ? (
          <Marker
            position={[position.lat, position.lng]}
            icon={markerIcon}
            draggable
            eventHandlers={{
              dragend(event) {
                const marker = event.target;
                const nextPosition = marker.getLatLng();
                onChange(nextPosition.lat, nextPosition.lng);
              },
            }}
          />
        ) : null}
      </MapContainer>
    </div>
  );
}
