import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';

const ShopMarker = ({ map, shop, onGetDirections }) => {
  const markerRef = useRef(null);

  useEffect(() => {
    if (!map || !shop) return;

    const coordinates = shop.location?.coordinates;
    if (!coordinates || coordinates.length < 2) return;

    // Create a container element for the popup content
    const popupContainer = document.createElement('div');
    popupContainer.style.color = 'var(--text-main)';
    popupContainer.style.fontFamily = 'var(--sans)';
    popupContainer.style.padding = '0.4rem';
    popupContainer.style.maxWidth = '210px';

    popupContainer.innerHTML = `
      <h4 style="margin: 0 0 6px; color: var(--primary); font-size: 0.95rem; font-weight: 700;">${shop.name}</h4>
      <p style="margin: 0 0 6px; font-size: 0.75rem; color: var(--text-muted); line-height: 1.3;">📍 ${shop.address}</p>
      <p style="margin: 0 0 8px; font-size: 0.75rem; font-weight: 700; color: #d97706;">
        ⭐ ${shop.averageRating ? shop.averageRating.toFixed(1) : '0.0'} (${shop.reviewCount || 0} reviews)
      </p>
    `;

    // Instantiate and append the View Details button
    const detailsBtn = document.createElement('button');
    detailsBtn.innerText = 'View Details';
    detailsBtn.style.width = '100%';
    detailsBtn.style.padding = '6px';
    detailsBtn.style.background = 'var(--text-main)';
    detailsBtn.style.color = '#fff';
    detailsBtn.style.border = 'none';
    detailsBtn.style.borderRadius = '6px';
    detailsBtn.style.fontWeight = 'bold';
    detailsBtn.style.fontSize = '0.75rem';
    detailsBtn.style.cursor = 'pointer';
    detailsBtn.style.marginBottom = '6px';
    detailsBtn.style.transition = 'opacity 0.15s ease';
    detailsBtn.onmouseenter = () => { detailsBtn.style.opacity = '0.9'; };
    detailsBtn.onmouseleave = () => { detailsBtn.style.opacity = '1'; };

    detailsBtn.addEventListener('click', () => {
      window.history.pushState({}, '', `/shops/${shop._id}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    // Instantiate and append the Get Directions trigger button
    const directionsBtn = document.createElement('button');
    directionsBtn.innerText = 'Get Directions';
    directionsBtn.style.width = '100%';
    directionsBtn.style.padding = '6px';
    directionsBtn.style.background = 'var(--primary)';
    directionsBtn.style.color = '#fff';
    directionsBtn.style.border = 'none';
    directionsBtn.style.borderRadius = '6px';
    directionsBtn.style.fontWeight = 'bold';
    directionsBtn.style.fontSize = '0.75rem';
    directionsBtn.style.cursor = 'pointer';
    directionsBtn.style.transition = 'opacity 0.15s ease';
    directionsBtn.onmouseenter = () => { directionsBtn.style.opacity = '0.9'; };
    directionsBtn.onmouseleave = () => { directionsBtn.style.opacity = '1'; };

    directionsBtn.addEventListener('click', () => {
      if (onGetDirections) {
        onGetDirections(shop);
      }
    });

    popupContainer.appendChild(detailsBtn);
    popupContainer.appendChild(directionsBtn);

    // Setup MapLibre popup wrapper
    const popup = new maplibregl.Popup({ offset: 25, closeButton: true })
      .setDOMContent(popupContainer);

    // Instantiate standard red marker and attach
    const marker = new maplibregl.Marker({ color: 'var(--primary)' })
      .setLngLat(coordinates)
      .setPopup(popup)
      .addTo(map);

    markerRef.current = marker;

    // Remove marker when unmounted
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, [map, shop, onGetDirections]);

  return null;
};

export default ShopMarker;
