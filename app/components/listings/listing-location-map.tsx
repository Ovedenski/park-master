// components/listings/listing-location-map.tsx
"use client";

import dynamic from "next/dynamic";

type ListingLocationMapProps = {
  latitude: number | string;
  longitude: number | string;
  address?: string | null;
};

const ListingLocationMapInner = dynamic(
  () => import("@/components/listings/listing-location-map-inner"),
  {
    ssr: false,
  },
);

export default function ListingLocationMap({
  latitude,
  longitude,
  address,
}: ListingLocationMapProps) {
  return (
    <ListingLocationMapInner
      latitude={latitude}
      longitude={longitude}
      address={address}
    />
  );
}
