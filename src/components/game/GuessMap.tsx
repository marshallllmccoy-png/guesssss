'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import { GamePhase } from '@/types/game';
import { SPRING_BOUNCY } from '@/lib/constants';

// Fix Leaflet default icon paths in bundler
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: '', iconUrl: '', shadowUrl: '' });

const CHINA_CENTER: [number, number] = [35.0, 104.0];
const DEFAULT_ZOOM = 5;
// OpenStreetMap 中文标注瓦片
const TILE_URL = 'https://tile.openstreetmap.de/{z}/{x}/{y}.png';
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors';

function makeGuessIcon(isReveal: boolean) {
  const s = isReveal ? 18 : 22;
  return L.divIcon({
    className: '',
    html: `<div style="width:${s}px;height:${s}px;background:#a78bfa;border:2px solid #fff;border-radius:50%;box-shadow:0 0 14px rgba(167,139,250,0.5)"></div>`,
    iconSize: [s, s],
    iconAnchor: [s / 2, s / 2],
  });
}

function makeRealIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="width:26px;height:26px;background:#22c55e;border:2px solid #fff;border-radius:50%;box-shadow:0 0 18px rgba(34,197,94,0.5);display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:bold">&#10003;</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

interface GuessMapProps {
  phase: GamePhase;
  onGuess: (lat: number, lng: number) => void;
  guessPosition: { lat: number; lng: number } | null;
  realLocation: { lat: number; lng: number } | null;
  className?: string;
}

export default function GuessMap({
  phase,
  onGuess,
  guessPosition,
  realLocation,
  className = '',
}: GuessMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const guessMarkerRef = useRef<L.Marker | null>(null);
  const realMarkerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const [ready, setReady] = useState(false);
  const onGuessRef = useRef(onGuess);
  onGuessRef.current = onGuess;

  const isLocked = phase === GamePhase.CONFIRMING ||
    phase === GamePhase.REVEALING_RESULT ||
    phase === GamePhase.ROUND_TRANSITION;

  const canInteract = phase === GamePhase.GUESSING || phase === GamePhase.SHOWING_LOCATION;
  const canInteractRef = useRef(canInteract);
  canInteractRef.current = canInteract;

  // Init map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: CHINA_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      attributionControl: false,
      zoomSnap: 0,
      zoomDelta: 0.5,
      wheelPxPerZoomLevel: 40,
      bounceAtZoomLimits: false,
      inertia: true,
      inertiaDeceleration: 3000,
    });

    // Custom glass-style zoom control
    const ZoomControl = L.Control.extend({
      options: { position: 'topright' },
      onAdd() {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        container.style.border = 'none';
        container.style.boxShadow = 'none';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '4px';

        const btnStyle = `
          width: 34px; height: 34px;
          background: rgba(0,0,0,0.65);
          border: none;
          border-radius: 10px;
          color: rgba(255,255,255,0.9);
          font-size: 20px;
          font-weight: 400;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s;
          user-select: none;
          line-height: 1;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        `;

        const zoomIn = L.DomUtil.create('button', '');
        zoomIn.innerHTML = '+';
        zoomIn.setAttribute('style', btnStyle);
        zoomIn.setAttribute('aria-label', 'Zoom in');
        L.DomEvent.on(zoomIn, 'mouseover', () => { zoomIn.style.background = 'rgba(0,0,0,0.8)'; });
        L.DomEvent.on(zoomIn, 'mouseout', () => { zoomIn.style.background = 'rgba(0,0,0,0.65)'; });
        L.DomEvent.on(zoomIn, 'click', (e) => { L.DomEvent.stop(e); map.zoomIn(); });

        const zoomOut = L.DomUtil.create('button', '');
        zoomOut.innerHTML = '−';
        zoomOut.setAttribute('style', btnStyle);
        zoomOut.setAttribute('aria-label', 'Zoom out');
        L.DomEvent.on(zoomOut, 'mouseover', () => { zoomOut.style.background = 'rgba(0,0,0,0.8)'; });
        L.DomEvent.on(zoomOut, 'mouseout', () => { zoomOut.style.background = 'rgba(0,0,0,0.65)'; });
        L.DomEvent.on(zoomOut, 'click', (e) => { L.DomEvent.stop(e); map.zoomOut(); });

        container.appendChild(zoomIn);
        container.appendChild(zoomOut);
        return container;
      },
    });
    map.addControl(new ZoomControl());

    L.tileLayer(TILE_URL, {
      attribution: TILE_ATTR,
      maxZoom: 18,
    }).addTo(map);

    map.on('click', (e: L.LeafletMouseEvent) => {
      if (canInteractRef.current) {
        onGuessRef.current(e.latlng.lat, e.latlng.lng);
      }
    });

    mapRef.current = map;
    const sizeTimer = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
        setReady(true);
      }
    }, 200);

    return () => {
      clearTimeout(sizeTimer);
      map.remove();
      mapRef.current = null;
    };
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Guess marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !guessPosition) return;

    if (guessMarkerRef.current) {
      map.removeLayer(guessMarkerRef.current);
      guessMarkerRef.current = null;
    }

    const isReveal = phase === GamePhase.REVEALING_RESULT;
    const marker = L.marker([guessPosition.lat, guessPosition.lng], {
      icon: makeGuessIcon(isReveal),
    }).addTo(map);
    guessMarkerRef.current = marker;
  }, [guessPosition, phase]);

  // Reveal: real marker + line + fit
  useEffect(() => {
    const map = mapRef.current;
    if (phase !== GamePhase.REVEALING_RESULT || !realLocation || !guessPosition || !map) return;

    // Real marker
    if (realMarkerRef.current) { map.removeLayer(realMarkerRef.current); }
    realMarkerRef.current = L.marker([realLocation.lat, realLocation.lng], {
      icon: makeRealIcon(),
    }).addTo(map);

    // Line
    if (polylineRef.current) { map.removeLayer(polylineRef.current); }
    polylineRef.current = L.polyline(
      [[guessPosition.lat, guessPosition.lng], [realLocation.lat, realLocation.lng]],
      { color: '#a78bfa', weight: 2, opacity: 0.7, dashArray: '10, 5' }
    ).addTo(map);

    const bounds = L.latLngBounds([
      [guessPosition.lat, guessPosition.lng],
      [realLocation.lat, realLocation.lng],
    ]);
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [phase, realLocation, guessPosition]);

  // Clear reveal layers on new round
  useEffect(() => {
    const map = mapRef.current;
    if ((phase === GamePhase.LOADING_LOCATION || phase === GamePhase.SHOWING_LOCATION) && map) {
      if (realMarkerRef.current) { map.removeLayer(realMarkerRef.current); realMarkerRef.current = null; }
      if (polylineRef.current) { map.removeLayer(polylineRef.current); polylineRef.current = null; }
    }
  }, [phase]);

  return (
    <motion.div
      className={`${className} rounded-2xl overflow-hidden border border-white/5 ${
        isLocked ? 'pointer-events-none' : ''
      }`}
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING_BOUNCY, duration: 0.6 }}
    >
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ minHeight: 300, background: '#0f0f15', touchAction: isLocked ? 'auto' : 'none' }}
      />
    </motion.div>
  );
}
