'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const AMAP_KEY = process.env.NEXT_PUBLIC_AMAP_KEY || '';
const AMAP_SECURITY = process.env.NEXT_PUBLIC_AMAP_SECURITY_CODE || '';

interface UseAMapOptions {
  containerRef: React.RefObject<HTMLDivElement | null>;
  onClick?: (lat: number, lng: number) => void;
}

export function useAMap({ containerRef, onClick }: UseAMapOptions) {
  const mapRef = useRef<AMap.Map | null>(null);
  const guessMarkerRef = useRef<AMap.Marker | null>(null);
  const realMarkerRef = useRef<AMap.Marker | null>(null);
  const polylineRef = useRef<AMap.Polyline | null>(null);

  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  // Load AMap script
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.AMap) {
      setIsScriptLoaded(true);
      return;
    }

    const existingScript = document.querySelector('script[src*="webapi.amap.com"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => setIsScriptLoaded(true));
      return;
    }

    window._AMapSecurityConfig = { securityJsCode: AMAP_SECURITY };

    const script = document.createElement('script');
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}`;
    script.async = true;

    script.onload = () => setIsScriptLoaded(true);
    script.onerror = () => setScriptError(true);

    document.head.appendChild(script);

    return () => {
      // Don't remove script on unmount — it might be needed by other instances
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isScriptLoaded || !containerRef.current || mapRef.current) return;
    if (!window.AMap) return;

    const container = containerRef.current;
    if (container.clientHeight === 0) return;

    const map = new window.AMap.Map(container, {
      zoom: 5,
      center: [104.0, 35.0],
      mapStyle: 'amap://styles/dark',
      resizeEnable: true,
      dragEnable: true,
      zoomEnable: true,
      doubleClickZoom: false,
      touchZoom: true,
      scrollWheel: true,
    });

    map.on('click', (e: AMap.AMapEvent) => {
      const lng = e.lnglat.getLng();
      const lat = e.lnglat.getLat();
      onClick?.(lat, lng);
    });

    mapRef.current = map;
    setIsMapReady(true);

    return () => {
      map.destroy();
      mapRef.current = null;
      setIsMapReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScriptLoaded]);

  const placeGuessMarker = useCallback((lat: number, lng: number) => {
    if (!mapRef.current || !window.AMap) return;

    if (guessMarkerRef.current) {
      mapRef.current.remove(guessMarkerRef.current);
    }

    const marker = new window.AMap.Marker({
      position: [lng, lat],
      content: `<div style="
        width: 24px; height: 24px;
        background: #a78bfa;
        border: 3px solid #fff;
        border-radius: 50%;
        box-shadow: 0 0 16px rgba(167,139,250,0.6);
        transform: translate(-50%, -50%);
      "></div>`,
      offset: [0, 0],
    });

    marker.setMap(mapRef.current);
    guessMarkerRef.current = marker;
  }, []);

  const showRealLocation = useCallback((lat: number, lng: number) => {
    if (!mapRef.current || !window.AMap) return;

    if (realMarkerRef.current) {
      mapRef.current.remove(realMarkerRef.current);
    }

    const marker = new window.AMap.Marker({
      position: [lng, lat],
      content: `<div style="
        width: 28px; height: 28px;
        background: #22c55e;
        border: 3px solid #fff;
        border-radius: 50%;
        box-shadow: 0 0 20px rgba(34,197,94,0.6);
        transform: translate(-50%, -50%);
        display: flex; align-items: center; justify-content: center;
        color: #fff; font-size: 14px;
      ">✓</div>`,
      offset: [0, 0],
    });

    marker.setMap(mapRef.current);
    realMarkerRef.current = marker;
  }, []);

  const drawConnectionLine = useCallback((guessLat: number, guessLng: number, realLat: number, realLng: number) => {
    if (!mapRef.current || !window.AMap) return;

    if (polylineRef.current) {
      mapRef.current.remove(polylineRef.current);
    }

    const polyline = new window.AMap.Polyline({
      path: [[guessLng, guessLat], [realLng, realLat]],
      strokeColor: '#a78bfa',
      strokeWeight: 2,
      strokeOpacity: 0.7,
      strokeStyle: 'dashed',
      strokeDasharray: [10, 5],
      lineJoin: 'round',
      lineCap: 'round',
      showDir: true,
    });

    polyline.setMap(mapRef.current);
    polylineRef.current = polyline;
  }, []);

  const fitBothMarkers = useCallback((guessLat: number, guessLng: number, realLat: number, realLng: number) => {
    if (!mapRef.current) return;

    const minLng = Math.min(guessLng, realLng);
    const maxLng = Math.max(guessLng, realLng);
    const minLat = Math.min(guessLat, realLat);
    const maxLat = Math.max(guessLat, realLat);

    const padding = 0.5; // degrees
    mapRef.current.setFitView(
      [
        new window.AMap.Marker({ position: [minLng - padding, minLat - padding] }),
        new window.AMap.Marker({ position: [maxLng + padding, maxLat + padding] }),
      ],
      false,
      [60, 60, 60, 60],
      10
    );
  }, []);

  const clearAll = useCallback(() => {
    if (!mapRef.current) return;

    if (guessMarkerRef.current) {
      mapRef.current.remove(guessMarkerRef.current);
      guessMarkerRef.current = null;
    }
    if (realMarkerRef.current) {
      mapRef.current.remove(realMarkerRef.current);
      realMarkerRef.current = null;
    }
    if (polylineRef.current) {
      mapRef.current.remove(polylineRef.current);
      polylineRef.current = null;
    }
  }, []);

  const retry = useCallback(() => {
    setScriptError(false);
    setIsScriptLoaded(false);
  }, []);

  return {
    isScriptLoaded,
    isMapReady,
    scriptError,
    placeGuessMarker,
    showRealLocation,
    drawConnectionLine,
    fitBothMarkers,
    clearAll,
    retry,
  };
}
