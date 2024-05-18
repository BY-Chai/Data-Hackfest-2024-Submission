"use client";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN as string;

interface MapReceive {
  getErrorList: (mapError: MapError) => void;
  getFinalLocation: (location: [number, number]) => void;
}

type MapError = {
  location: boolean;
  access: boolean;
};

function MapInput({ getErrorList, getFinalLocation }: MapReceive) {
  const mapContainerRef = useRef(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const [searchingTerm, setSearchingTerm] = useState<string>("");
  const [searchedPlaces, setSearchedPlaces] = useState<SearchedPlaces[]>([]);
  const [searchedLocation, setSearchedLocation] = useState<[number, number]>([
    0, 0,
  ]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorList, setErrorList] = useState<MapError>({
    location: true,
    access: true,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: the canvas keeps being loaded and added every time the users click on the map
  useEffect(() => {
    if (!mapContainerRef.current) {
      return;
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [0, 0],
      zoom: 10,
    });

    const marker = new mapboxgl.Marker({
      color: "#ff0000",
    })
      .setLngLat(searchedLocation)
      .addTo(map);

    mapRef.current = map;
    markerRef.current = marker;

    map.on("click", async (event) => {
      const lanLatLikArray: [number, number] = [
        event.lngLat.lng,
        event.lngLat.lat,
      ];
      marker.setLngLat(lanLatLikArray);
      setSearchedLocation(lanLatLikArray);

      const searchedCoordinates = await searchCoordinate(...lanLatLikArray);

      if (searchedCoordinates.searchedPlaces.length <= 0) {
        setSearchingTerm("");
      } else {
        setSearchingTerm(searchedCoordinates.searchedPlaces[0].name);
      }
    });

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const lng = position.coords.longitude;
          const lat = position.coords.latitude;

          setSearchedLocation([lng, lat]);
          setIsLoading(false);
          setErrorList((prev) => {
            prev.access = false;
            return prev;
          });

          if (mapRef.current) {
            mapRef.current.setCenter([lng, lat]);
          }
        },
        () => {
          setErrorList((prev) => {
            prev.access = true;
            return prev;
          });
        },
      );
    } else {
      setErrorList((prev) => {
        prev.access = true;
        return prev;
      });
    }

    return () => {};
  }, []);

  useEffect(() => {
    if (!markerRef.current) return;
    markerRef.current.setLngLat(searchedLocation);
  }, [searchedLocation]);

  useEffect(() => {
    getErrorList(errorList);
    return;
  }, [errorList, getErrorList]);

  useEffect(() => {
    getFinalLocation(searchedLocation);
    return;
  }, [searchedLocation, getFinalLocation]);

  return (
    <div className="relative w-full">
      <div className="w-full">
        <input
          className="w-full rounded-t-sm py-2 px-3 border box-border hover:border-gray-500 focus:border-gray-500 focus:outline-none"
          placeholder="Search for where you live..."
          value={searchingTerm}
          autoComplete="address-line1 webauthn"
          onChange={async (inputEvent) => {
            const searchTerm = inputEvent.currentTarget.value;
            setSearchingTerm(searchTerm);
            const searchedPlaces = await searchPlace(searchTerm);
            setSearchedPlaces(searchedPlaces.searchedPlaces);
          }}
        />

        <div className="w-full relative">
          <div className="w-full absolute top-0 left-0 z-20 bg-white bg-opacity-95">
            {searchedPlaces.map((currentSearchedPlace) => (
              // biome-ignore lint/a11y/useKeyWithClickEvents: I mean why?
              <div
                key={currentSearchedPlace.name}
                className="cursor-pointer py-2 px-3 border hover:border-gray-500 focus:border-gray-500"
                onClick={() => {
                  setSearchedPlaces([]);
                  setSearchingTerm(currentSearchedPlace.name);
                  setSearchedLocation(currentSearchedPlace.location);

                  if (mapRef.current) {
                    mapRef.current.setCenter(currentSearchedPlace.location);
                    mapRef.current.setZoom(12);
                  }
                }}>
                {currentSearchedPlace.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        ref={mapContainerRef}
        className="transition-colors w-full aspect-video rounded-b-sm border hover:border-gray-500 focus:border-gray-500"
      />

      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-20 z-20 rounded-sm flex items-center justify-center cursor-not-allowed">
          <AiOutlineLoading3Quarters
            className="animate-loading"
            size={50}
            color="white"
          />
        </div>
      )}
    </div>
  );
}

interface SearchPlaceReturn {
  searchedPlaces: SearchedPlaces[];
}

type SearchedPlaces = {
  location: [number, number];
  name: string;
};

const searchPlace = async (query: string): Promise<SearchPlaceReturn> => {
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      query,
    )}.json?access_token=${mapboxgl.accessToken}`,
  );
  const data = await response.json();
  if (data.features.length > 0) {
    const returnedValue: SearchedPlaces[] = [];

    for (const currentFeature of data.features) {
      returnedValue.push({
        location: currentFeature.center,
        name: currentFeature.place_name,
      });
    }

    return {
      searchedPlaces: returnedValue,
    };
  }

  return { searchedPlaces: [] };
};

const searchCoordinate = async (
  lng: number,
  lat: number,
): Promise<SearchPlaceReturn> => {
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`,
  );
  const data = await response.json();

  if (data.features.length > 0) {
    const returnedValue: SearchedPlaces[] = [];

    for (const currentFeature of data.features) {
      returnedValue.push({
        location: currentFeature.center,
        name: currentFeature.place_name,
      });
    }

    return {
      searchedPlaces: returnedValue,
    };
  }

  return { searchedPlaces: [] };
};

export default MapInput;
