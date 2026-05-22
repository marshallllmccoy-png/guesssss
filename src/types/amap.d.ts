export {};

declare global {
  interface Window {
    AMap: typeof AMap;
    _AMapSecurityConfig: { securityJsCode: string };
  }

  namespace AMap {
    class Map {
      constructor(container: string | HTMLDivElement, opts: MapOptions);
      on(event: string, callback: (e: AMapEvent) => void): void;
      destroy(): void;
      setCenter(center: [number, number]): void;
      setZoom(zoom: number): void;
      getZoom(): number;
      add(overlay: unknown): void;
      remove(overlay: unknown): void;
      clearMap(): void;
      setFitView(overlays?: unknown[], immediate?: boolean, avoid?: number[], maxZoom?: number): void;
      getCenter(): LngLat;
    }

    class LngLat {
      getLng(): number;
      getLat(): number;
    }

    class Marker {
      constructor(opts: MarkerOptions);
      setPosition(position: [number, number]): void;
      getPosition(): [number, number];
      setMap(map: Map | null): void;
      setContent(content: string): void;
      on(event: string, callback: () => void): void;
    }

    class Polyline {
      constructor(opts: PolylineOptions);
      setMap(map: Map | null): void;
    }

    interface MapOptions {
      zoom?: number;
      center?: [number, number];
      mapStyle?: string;
      resizeEnable?: boolean;
      dragEnable?: boolean;
      zoomEnable?: boolean;
      doubleClickZoom?: boolean;
      touchZoom?: boolean;
      scrollWheel?: boolean;
    }

    interface MarkerOptions {
      position?: [number, number];
      icon?: string | HTMLImageElement;
      offset?: [number, number];
      animation?: string;
      title?: string;
      content?: string;
    }

    interface PolylineOptions {
      path?: [number, number][];
      strokeColor?: string;
      strokeWeight?: number;
      strokeOpacity?: number;
      strokeStyle?: 'solid' | 'dashed';
      strokeDasharray?: [number, number];
      lineJoin?: 'round';
      lineCap?: 'round';
      showDir?: boolean;
    }

    interface AMapEvent {
      lnglat: LngLat;
    }
  }
}
