"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./styles/location.module.css";

type LocationMapProps = {
  lat: number;
  lon: number;
  zoom?: number;
  title: string;
};

type YMapsApi = {
  ready: (cb: () => void) => void;
  Map: new (
    el: HTMLElement,
    state: {
      center: [number, number];
      zoom: number;
      controls?: string[];
    },
    options?: Record<string, unknown>,
  ) => YMapInstance;
  Placemark: new (
    coords: [number, number],
    properties?: Record<string, unknown>,
    options?: Record<string, unknown>,
  ) => unknown;
  templateLayoutFactory: {
    createClass: (html: string) => unknown;
  };
};

type YMapInstance = {
  destroy: () => void;
  geoObjects: { add: (obj: unknown) => void };
  container: { fitToViewport: () => void };
  behaviors: { disable: (name: string) => void };
};

declare global {
  interface Window {
    ymaps?: YMapsApi;
  }
}

const PIN_HTML = `
  <div class="${styles.mapPinMarker}">
    <span class="${styles.mapPinPulse}"></span>
    <span class="${styles.mapPinBadge}">
      <svg class="${styles.mapPinIcon}" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
  </div>
`;

let ymapsLoader: Promise<YMapsApi> | null = null;

function loadYmaps() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("ymaps is browser-only"));
  }

  if (window.ymaps) {
    const api = window.ymaps;
    return new Promise<YMapsApi>((resolve) => {
      api.ready(() => resolve(api));
    });
  }

  if (ymapsLoader) return ymapsLoader;

  const key = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;
  const params = new URLSearchParams({ lang: "ru_RU" });
  if (key) params.set("apikey", key);

  ymapsLoader = new Promise<YMapsApi>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://api-maps.yandex.ru/2.1/?${params.toString()}`;
    script.async = true;
    script.onload = () => {
      const api = window.ymaps;
      if (!api) {
        reject(new Error("Yandex Maps failed to load"));
        return;
      }
      api.ready(() => resolve(api));
    };
    script.onerror = () => reject(new Error("Yandex Maps failed to load"));
    document.head.appendChild(script);
  });

  return ymapsLoader;
}

function widgetSrc(lat: number, lon: number, zoom: number) {
  return `https://yandex.ru/map-widget/v1/?ll=${lon}%2C${lat}&z=${zoom}&l=map&scroll=false`;
}

export default function LocationMap({
  lat,
  lon,
  zoom = 17,
  title,
}: LocationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [useWidget, setUseWidget] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || useWidget) return;

    let cancelled = false;
    let map: YMapInstance | null = null;
    let resizeObserver: ResizeObserver | null = null;

    loadYmaps()
      .then((ymaps) => {
        if (cancelled || !containerRef.current) return;

        map = new ymaps.Map(
          el,
          {
            center: [lat, lon],
            zoom,
            controls: [
              "zoomControl",
              "geolocationControl",
              "fullscreenControl",
              "typeSelector",
            ],
          },
          {
            suppressMapOpenBlock: false,
            yandexMapDisablePoiInteractivity: true,
          },
        );

        map.behaviors.disable("scrollZoom");

        const iconLayout = ymaps.templateLayoutFactory.createClass(PIN_HTML);
        const placemark = new ymaps.Placemark(
          [lat, lon],
          { hintContent: title },
          {
            iconLayout,
            iconOffset: [-26, -62],
            iconShape: {
              type: "Rectangle",
              coordinates: [
                [-26, -62],
                [26, 2],
              ],
            },
          },
        );

        map.geoObjects.add(placemark);
        map.container.fitToViewport();

        resizeObserver = new ResizeObserver(() => {
          map?.container.fitToViewport();
        });
        resizeObserver.observe(el);
      })
      .catch(() => {
        if (!cancelled) setUseWidget(true);
      });

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      map?.destroy();
    };
  }, [lat, lon, zoom, title, useWidget]);

  if (useWidget) {
    return (
      <iframe
        title={title}
        src={widgetSrc(lat, lon, zoom)}
        loading="lazy"
        allowFullScreen
        className={styles.mapWidget}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={styles.mapCanvas}
      role="presentation"
      aria-label={title}
    />
  );
}
