"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

type NominatimResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: NominatimAddress;
};

type NominatimAddress = {
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  suburb?: string;
  neighbourhood?: string;
  quarter?: string;
  city_district?: string;
  county?: string;
  state?: string;
};


type AddressPickerProps = {
  defaultAddress?: string | null;
  defaultLatitude?: number | string | null;
  defaultLongitude?: number | string | null;
  addressError?: string;
  latitudeError?: string;
  longitudeError?: string;
};

const MapPicker = dynamic(() => import("@/components/listings/map-picker"), {
  ssr: false,
});

export default function AddressPicker({
  defaultAddress,
  defaultLatitude,
  defaultLongitude,
  addressError,
  latitudeError,
  longitudeError,
}: AddressPickerProps) {
  const [address, setAddress] = useState(defaultAddress ?? "");
  const [query, setQuery] = useState(defaultAddress ?? "");
  const [latitude, setLatitude] = useState(
    defaultLatitude ? String(defaultLatitude) : "",
  );
  const [longitude, setLongitude] = useState(
    defaultLongitude ? String(defaultLongitude) : "",
  );
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const position = useMemo(() => {
    if (!latitude || !longitude) return null;

    return {
      lat: Number(latitude),
      lng: Number(longitude),
    };
  }, [latitude, longitude]);

  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setIsSearching(true);

      try {
        const params = new URLSearchParams({
          q: query,
          format: "json",
          addressdetails: "1",
          limit: "5",
          countrycodes: "bg",
        });

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?${params.toString()}`,
        );

        const data = (await response.json()) as NominatimResult[];
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 600);

    return () => clearTimeout(timeout);
  }, [query]);

  function selectResult(result: NominatimResult) {
    const nextCity =
      result.address?.city ??
      result.address?.town ??
      result.address?.village ??
      result.address?.municipality ??
      "";

    const nextDistrict =
      result.address?.suburb ??
      result.address?.neighbourhood ??
      result.address?.quarter ??
      result.address?.city_district ??
      result.address?.county ??
      "";

    setAddress(result.display_name);
    setQuery(result.display_name);
    setLatitude(result.lat);
    setLongitude(result.lon);
    setCity(nextCity);
    setDistrict(nextDistrict);
    setResults([]);
  }

  async function handleMapChange(lat: number, lng: number) {
  setLatitude(String(lat));
  setLongitude(String(lng));

  try {
    const params = new URLSearchParams({
      format: "json",
      lat: String(lat),
      lon: String(lng),
      addressdetails: "1",
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
    );

    const data = await response.json();

    if (data?.display_name) {
      setAddress(data.display_name);
      setQuery(data.display_name);
    }
  } catch {
    // Keep coordinates even if reverse geocoding fails.
  }
}

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="address-search" className="text-sm font-medium">
          Address
        </label>

        <input
          id="address-search"
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setAddress(event.target.value);
          }}
          placeholder="Search address, for example: Vitosha Blvd, Sofia"
          className="w-full rounded-md border px-3 py-2"
        />

        <input type="hidden" name="address" value={address} />
        <input type="hidden" name="latitude" value={latitude} />
        <input type="hidden" name="longitude" value={longitude} />
        <input type="hidden" name="city" value={city} />
        <input type="hidden" name="district" value={district} />

        {isSearching ? (
          <p className="text-sm text-muted-foreground">Searching...</p>
        ) : null}

        {results.length > 0 ? (
          <div className="overflow-hidden rounded-md border bg-background">
            {results.map((result) => (
              <button
                key={result.place_id}
                type="button"
                onClick={() => selectResult(result)}
                className="block w-full border-b px-3 py-2 text-left text-sm last:border-b-0 hover:bg-muted"
              >
                {result.display_name}
              </button>
            ))}
          </div>
        ) : null}

        {addressError ? (
          <p className="text-sm text-red-600">{addressError}</p>
        ) : null}

        {latitudeError ? (
          <p className="text-sm text-red-600">{latitudeError}</p>
        ) : null}

        {longitudeError ? (
          <p className="text-sm text-red-600">{longitudeError}</p>
        ) : null}
      </div>

      <MapPicker position={position} onChange={handleMapChange} />

      <p className="text-xs text-muted-foreground">
        Search for an address, then adjust the marker on the map if needed.
      </p>
    </div>
  );
}
