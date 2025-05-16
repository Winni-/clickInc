import React, { useState, useRef } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { Feature } from "geojson";
import { COLORS, COUNTRY_NAMES } from "../../constants";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { 
  selectCountry, 
  selectedCountry, 
  selectConqueredCountries, 
  conquerCountry,
  selectGame,
  selectMapEvents,
} from "../../app/gameSlice";
import { applyEventEffects } from "../../app/eventThunks";
import styles from './index.module.scss';
import { GameEvent } from "../../types";
import { DynamicEvents, GAME_EVENTS } from "../../Events";
import classNames from "classnames";

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface CountryMapProps {
  onCountryClick?: (pos: { x: number; y: number }) => void;
  showOnlySelected?: boolean;
  scale?: number;
  className?: string;
  visible?: boolean;
  allowConquest?: boolean; // New prop to enable conquest interaction
}

export const CountryMap = ({ 
  onCountryClick, 
  showOnlySelected = false,
  scale = 1,
  className = '',
  visible = false,
  allowConquest = false
}: CountryMapProps) => {
  const dispatch = useAppDispatch();
  const country = useAppSelector(selectedCountry);
  const conqueredCountries = useAppSelector(selectConqueredCountries);
  const mapEvents = useAppSelector(selectMapEvents);
  const gameState = useAppSelector(selectGame);
  const [bounceKey, setBounceKey] = useState(0);
  const mapRef = useRef<HTMLDivElement>(null);


  // Get countries targeted by active events (for highlighting)
  const targetedCountries = mapEvents
      .map(event => event?.targetCountry as string);

  // Find event markers to display
  const eventMarkers = (() => {
    const markers: { country: string; event: string; icon: string; position: [number, number] }[] = [];
    
    // Process all country-related events
    mapEvents.forEach(event => {
      if (event?.targetCountry && event?.id === 'BUY_COUNTRY') {
        // We'll calculate the position when we render geography features
        markers.push({
          country: event.targetCountry,
          event: event.id,
          icon: event?.icon || '🏳️',
          position: [0, 0] // Will be updated when rendering
        });
      }
    });
    
    return markers;
  })();

  const handleClick = (geo: Feature, event: React.MouseEvent) => {
    const clickPos = {
      x: event.clientX,
      y: event.clientY
    };
    
    const name = geo.properties?.name;
    if (!name) return;
    
    // Check if this country is targeted by an event
    const targetEvent = mapEvents.find(ev => 
      ev?.targetCountry === name 
    );
    
    if (targetEvent) {
      // Resolve the event and conquer the country
      dispatch(conquerCountry(name));
    }
    
    // Initial country selection
    if (!country && name) {
      dispatch(selectCountry(name));
    }
    // Click on already selected country
    else if (country === name) {
      onCountryClick?.(clickPos);
      setBounceKey(prev => prev + 1); // Increment key to restart animation
    }
    // Conquest click (if enabled)
    else if (allowConquest && name && !conqueredCountries.includes(name) && targetEvent?.targetCountry === name) {
      dispatch(conquerCountry(name));
    }
  };

  // Helper function to determine country fill color
  const getCountryFillColor = (geo: Feature) => {
    const name = geo.properties?.name;
    if (!name) return COLORS.Alabaster;
    
    if (name === country) {
      return COLORS.Tomato; // Selected country - main country
    } else if (conqueredCountries.includes(name)) {
      return '#F39C12'; // Conquered country - different color
    } else if (targetedCountries.includes(name)) {
      return '#3498DB'; // Country targeted by an event - highlight in blue
    } else {
      return COLORS.Alabaster; // Not conquered yet
    }
  };

  const handleFallback = () => {
    if (mapEvents.length > 0) {
      mapEvents.forEach(event => {  
        dispatch(conquerCountry(event?.targetCountry as string))
      })
    }
  }

  return (
    <div 
      ref={mapRef}
      className={`${styles.map} ${className} ${visible ? styles.visible : ''}`}
    >
      <ComposableMap projection="geoMercator">
        <Geographies geography={geoUrl}>
          {({ geographies }:{geographies: Feature[]}) => {
            
            return geographies
              .filter(geo => {
                const name = geo.properties?.name;
                if (!name) return false;
                
                return (
                  !showOnlySelected || 
                  name === country || 
                  conqueredCountries.includes(name) ||
                  targetedCountries.includes(name)
                );
              })
              .map((geo) => {
                const name = geo.properties?.name;
                if (!name) return null;
                
                const isSelected = name === country;
                const isConquered = conqueredCountries.includes(name);
                const isTargeted = targetedCountries.includes(name);
                
                return (
                  <Geography
                    key={`${name}-${bounceKey}-${isConquered ? 'conquered' : isTargeted ? 'targeted' : 'normal'}`}
                    geography={geo}
                    data-country={name}
                    onClick={(e) => handleClick(geo, e)}
                    className={`${isSelected ? styles.selected : ''} ${isConquered ? styles.conquered : ''} ${isTargeted ? styles.targeted : ''}`}
                    style={{
                      default: {
                        fill: getCountryFillColor(geo),
                        outline: 'none',
                        stroke: isTargeted ? '#3498DB' : undefined,
                        strokeWidth: isTargeted ? 1.5 : undefined
                      },
                      hover: {
                        fill: !country ? COLORS.Gunmetal : 
                              isSelected ? COLORS.Tomato : 
                              isConquered ? '#E67E22' : 
                              isTargeted ? '#2980B9' :
                              allowConquest ? '#AED6F1' : COLORS.Alabaster,
                        cursor: 'pointer',
                        strokeWidth: isTargeted ? 2 : undefined
                      },
                      pressed: {
                        fill: getCountryFillColor(geo),
                        outline: 'none',
                      },
                    }}
                  />
                );
              })
          }}
        </Geographies>
        
      </ComposableMap>
      <button className={classNames({
        [styles.fallback]: true,
        [styles.visible]: gameState.mapEvents.length > 0
      }) } onClick={handleFallback}>
        🌐
      </button>
    </div>
  );
}; 