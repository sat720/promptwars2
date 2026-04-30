'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Google Maps component for polling booth display
 * @param {{ lat: number, lng: number, boothName: string }} props
 */
export default function GoogleMap({ lat, lng, boothName }) {
  const mapRef = useRef(null);
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) { setError(true); return; }

    const initMap = () => {
      if (!mapRef.current || !window.google) return;
      try {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat, lng },
          zoom: 15,
          mapTypeId: 'roadmap',
          styles: [
            { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a2e' }] },
            { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#16213e' }] },
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0a0a0f' }] },
          ],
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: true,
          fullscreenControl: true,
        });

        // Booth marker
        new window.google.maps.Marker({
          position: { lat, lng },
          map,
          title: boothName,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: '#6366f1',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3,
          },
        });

        // Info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div style="padding:8px;font-family:Inter,sans-serif;color:#1a1a2e"><strong>🗳️ ${boothName}</strong><br/><span style="font-size:0.8rem">Polling Booth</span></div>`,
        });

        // Try to get user location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
              new window.google.maps.Marker({
                position: userPos,
                map,
                title: 'Your Location',
                icon: {
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: '#22c55e',
                  fillOpacity: 1,
                  strokeColor: '#fff',
                  strokeWeight: 2,
                },
              });
              // Draw route
              const directionsService = new window.google.maps.DirectionsService();
              const directionsRenderer = new window.google.maps.DirectionsRenderer({
                suppressMarkers: true,
                polylineOptions: { strokeColor: '#6366f1', strokeWeight: 4, strokeOpacity: 0.8 },
              });
              directionsRenderer.setMap(map);
              directionsService.route({
                origin: userPos,
                destination: { lat, lng },
                travelMode: window.google.maps.TravelMode.WALKING,
              }, (result, status) => {
                if (status === 'OK') directionsRenderer.setDirections(result);
              });
            },
            () => {} // Silently ignore location denial
          );
        }

        setLoaded(true);
      } catch (err) {
        setError(true);
      }
    };

    if (window.google) {
      initMap();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      script.onerror = () => setError(true);
      document.head.appendChild(script);
    }
  }, [lat, lng, boothName]);

  if (error) {
    return (
      <div style={{ height: 300, background: 'var(--bg3)', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <div style={{ fontSize: '2rem' }}>🗺️</div>
        <div style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>Map unavailable</div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
          target="_blank" rel="noopener noreferrer"
          className="btn btn-outline btn-sm"
        >
          Open in Google Maps
        </a>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', height: 300 }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: 12 }} aria-label={`Google Map showing location of ${boothName}`} role="application" />
      {!loaded && <div className="skeleton" style={{ position: 'absolute', inset: 0, borderRadius: 12 }} />}
    </div>
  );
}
