'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: '', iconUrl: '', shadowUrl: '' });

const TILE_URL = 'https://tile.openstreetmap.de/{z}/{x}/{y}.png';
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors';

function makeGuessIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="width:16px;height:16px;background:#e2483a;border:2px solid #fff;border-radius:50%;box-shadow:0 0 10px rgba(226,72,58,0.5)"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function makeRealIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="width:20px;height:20px;background:#22c55e;border:2px solid #fff;border-radius:50%;box-shadow:0 0 12px rgba(34,197,94,0.5);display:flex;align-items:center;justify-content:center;color:#fff;font-size:10px;font-weight:bold">&#10003;</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

interface MiniResultMapProps {
  guessLat: number;
  guessLng: number;
  realLat: number;
  realLng: number;
}

export default function MiniResultMap({ guessLat, guessLng, realLat, realLng }: MiniResultMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      attributionControl: false,
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      keyboard: false,
      zoomSnap: 0.25,
    });

    L.tileLayer(TILE_URL, { attribution: TILE_ATTR, maxZoom: 18 }).addTo(map);

    const guessMarker = L.marker([guessLat, guessLng], { icon: makeGuessIcon() }).addTo(map);
    const realMarker = L.marker([realLat, realLng], { icon: makeRealIcon() }).addTo(map);

    L.polyline(
      [[guessLat, guessLng], [realLat, realLng]],
      { color: '#e2483a', weight: 1.5, opacity: 0.6, dashArray: '6, 4' }
    ).addTo(map);

    const bounds = L.latLngBounds(
      [guessLat, guessLng],
      [realLat, realLng]
    );

    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14, animate: false });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-xl overflow-hidden border border-white/5"
      style={{ height: 200, background: '#161412' }}
    />
  );
}
