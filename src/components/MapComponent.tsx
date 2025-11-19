'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface MapComponentProps {
  latitude?: number;
  longitude?: number;
  markers?: Array<{
    id: string;
    lat: number;
    lng: number;
    title: string;
    riskLevel?: 'GREEN' | 'AMBER' | 'RED';
  }>;
  onLocationSelect?: (lat: number, lng: number) => void;
  height?: string;
  zoom?: number;
}

export default function MapComponent({
  latitude = 53.3498,
  longitude = -6.2603,
  markers = [],
  onLocationSelect,
  height = '400px',
  zoom = 13,
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
    });

    loader.load().then(() => {
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (isLoaded && mapRef.current && !map) {
      const newMap = new google.maps.Map(mapRef.current, {
        center: { lat: latitude, lng: longitude },
        zoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });

      setMap(newMap);

      if (onLocationSelect) {
        newMap.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            onLocationSelect(e.latLng.lat(), e.latLng.lng());
          }
        });
      }
    }
  }, [isLoaded, map, latitude, longitude, zoom, onLocationSelect]);

  useEffect(() => {
    if (map && markers.length > 0) {
      // Clear existing markers
      markers.forEach((markerData) => {
        const color =
          markerData.riskLevel === 'RED'
            ? '#ef4444'
            : markerData.riskLevel === 'AMBER'
            ? '#f59e0b'
            : '#22c55e';

        const marker = new google.maps.Marker({
          position: { lat: markerData.lat, lng: markerData.lng },
          map,
          title: markerData.title,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: color,
            fillOpacity: 0.8,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        });

        marker.addListener('click', () => {
          const infoWindow = new google.maps.InfoWindow({
            content: `<div class="p-2"><strong>${markerData.title}</strong></div>`,
          });
          infoWindow.open(map, marker);
        });
      });
    }
  }, [map, markers]);

  return (
    <div className="w-full">
      <div ref={mapRef} style={{ width: '100%', height }} className="rounded-lg" />
      {!isLoaded && (
        <div
          style={{ height }}
          className="w-full bg-gray-100 rounded-lg flex items-center justify-center"
        >
          <p className="text-gray-500">Loading map...</p>
        </div>
      )}
    </div>
  );
}
