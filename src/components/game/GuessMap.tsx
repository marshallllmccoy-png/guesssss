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
    html: `<div style="width:${s}px;height:${s}px;background:#e2483a;border:2px solid #fff;border-radius:50%;box-shadow:0 0 14px rgba(226,72,58,0.5)"></div>`,
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

    // Center the right-side Leaflet controls vertically
    const styleEl = L.DomUtil.create('style', '');
    styleEl.textContent = '.leaflet-right{top:50%!important;transform:translateY(-50%)!important;right:10px!important}';
    document.head.appendChild(styleEl);

    // Vertical zoom bar: + button, draggable slider, - button
    const ZoomBarControl = L.Control.extend({
      options: { position: 'topright' as L.ControlPosition },
      onAdd() {
        const container = L.DomUtil.create('div', '');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.gap = '6px';

        const TRACK_H = 132;
        const KNOB_SIZE = 22;
        const ZOOM_SNAP = 0.5;

        const btnStyle = `
          width: 32px; height: 32px;
          background: rgba(0,0,0,0.65);
          border: none;
          border-radius: 10px;
          color: rgba(255,255,255,0.9);
          font-size: 18px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s;
          user-select: none;
          line-height: 1;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        `;

        // + button
        const zoomIn = L.DomUtil.create('button', '');
        zoomIn.innerHTML = '+';
        zoomIn.setAttribute('style', btnStyle);
        zoomIn.setAttribute('aria-label', 'Zoom in');
        L.DomEvent.on(zoomIn, 'click', (e) => { L.DomEvent.stop(e); map.zoomIn(); });

        // Track wrapper
        const trackWrap = L.DomUtil.create('div', '');
        trackWrap.style.cssText = `position:relative;width:${KNOB_SIZE + 4}px;height:${TRACK_H}px;display:flex;align-items:center;justify-content:center;`;

        // Track bar
        const track = L.DomUtil.create('div', '');
        track.style.cssText = `
          width:4px;height:100%;background:rgba(255,255,255,0.22);
          border-radius:2px;cursor:pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        `;
        trackWrap.appendChild(track);

        // Knob
        const knob = L.DomUtil.create('div', '');
        knob.style.cssText = `
          width:${KNOB_SIZE}px;height:${KNOB_SIZE}px;
          background:#fff;
          border:2px solid rgba(0,0,0,0.12);
          border-radius:50%;
          position:absolute;left:50%;
          transform:translate(-50%,-50%);
          box-shadow: 0 2px 12px rgba(0,0,0,0.25);
          cursor:grab;
          z-index:1;
          transition: box-shadow 0.15s;
        `;
        trackWrap.appendChild(knob);

        // − button
        const zoomOut = L.DomUtil.create('button', '');
        zoomOut.innerHTML = '−';
        zoomOut.setAttribute('style', btnStyle);
        zoomOut.setAttribute('aria-label', 'Zoom out');
        L.DomEvent.on(zoomOut, 'click', (e) => { L.DomEvent.stop(e); map.zoomOut(); });

        container.appendChild(zoomIn);
        container.appendChild(trackWrap);
        container.appendChild(zoomOut);

        // Sync knob position to current zoom
        function setKnobFromZoom() {
          const z = map.getZoom();
          const minZ = map.getMinZoom();
          const maxZ = map.getMaxZoom();
          const ratio = (z - minZ) / (maxZ - minZ);
          const y = TRACK_H * (1 - ratio);
          knob.style.top = `${y}px`;
        }
        setKnobFromZoom();
        map.on('zoom', setKnobFromZoom);

        // Drag state
        let dragging = false;

        function zoomFromClientY(clientY: number) {
          const rect = track.getBoundingClientRect();
          const ratio = 1 - Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
          const minZ = map.getMinZoom();
          const maxZ = map.getMaxZoom();
          const raw = minZ + ratio * (maxZ - minZ);
          map.setZoom(Math.round(raw / ZOOM_SNAP) * ZOOM_SNAP);
        }

        function onDragStart(e: MouseEvent | TouchEvent) {
          dragging = true;
          knob.style.cursor = 'grabbing';
          knob.style.boxShadow = '0 0 0 6px rgba(0,0,0,0.12)';
          e.preventDefault();
        }
        function onDragMove(e: MouseEvent | TouchEvent) {
          if (!dragging) return;
          const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
          zoomFromClientY(clientY);
        }
        function onDragEnd() {
          if (!dragging) return;
          dragging = false;
          knob.style.cursor = 'grab';
          knob.style.boxShadow = '0 2px 12px rgba(0,0,0,0.25)';
        }

        knob.addEventListener('mousedown', onDragStart);
        knob.addEventListener('touchstart', onDragStart, { passive: false });
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('touchmove', onDragMove, { passive: false });
        document.addEventListener('mouseup', onDragEnd);
        document.addEventListener('touchend', onDragEnd);

        // Click track to jump zoom
        track.addEventListener('click', (e) => {
          zoomFromClientY(e.clientY);
        });

        return container;
      },
    });
    map.addControl(new ZoomBarControl());

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

  // Reveal: show real marker + line, fit both points in view
  useEffect(() => {
    const map = mapRef.current;
    if (phase !== GamePhase.REVEALING_RESULT || !realLocation || !guessPosition || !map) return;

    // Show real marker + line immediately
    if (realMarkerRef.current) { map.removeLayer(realMarkerRef.current); }
    realMarkerRef.current = L.marker([realLocation.lat, realLocation.lng], {
      icon: makeRealIcon(),
    }).addTo(map);

    if (polylineRef.current) { map.removeLayer(polylineRef.current); }
    polylineRef.current = L.polyline(
      [[guessPosition.lat, guessPosition.lng], [realLocation.lat, realLocation.lng]],
      { color: '#e2483a', weight: 2, opacity: 0.7, dashArray: '10, 5' }
    ).addTo(map);

    // Invalidate size first — container changed from flex-1 to fixed square
    map.invalidateSize();

    // Fit both points in view simultaneously
    const bounds = L.latLngBounds(
      [guessPosition.lat, guessPosition.lng],
      [realLocation.lat, realLocation.lng]
    );
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14, animate: true });

    // No cleanup needed — no timer, no flyTo, no setZoom after fitBounds
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
      className={`${className} rounded-2xl overflow-hidden border border-black/5 ${
        isLocked ? 'pointer-events-none' : ''
      }`}
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING_BOUNCY, duration: 0.6 }}
    >
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ minHeight: 300, background: '#f0ede7', touchAction: isLocked ? 'auto' : 'none' }}
      />
    </motion.div>
  );
}
