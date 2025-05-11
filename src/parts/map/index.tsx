import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Feature } from "geojson";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectCountry, selectedCountry } from "../../app/gameSlice";
import styles from './index.module.scss';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface MapProps {
  onCountryClick: (geo: Feature, pos: { x: number; y: number }) => void;
}

export const Map = ({ onCountryClick }: MapProps) => {
  const dispatch = useAppDispatch();
  const country = useAppSelector(selectedCountry);
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });

  const handleClick = (geo: Feature, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickPos = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    const name = geo.properties?.name;
    // выбираем страну в первый раз
    if (!country && name) {
      dispatch(selectCountry(name));
    }
    // кликаем по выбранной стране
    if (country === name) {
      onCountryClick(geo, clickPos);
    }
    // кликаем по событию
    
  };

  return (
    <div 
      className={`${styles.map} ${country && styles.selected}`}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMapPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }}
    >
      <ComposableMap projection="geoMercator">
        <Geographies geography={geoUrl}>
          {({ geographies }:{geographies: Feature[]}) =>
            geographies.map((geo) => (
              <Geography
                key={geo.properties?.name}
                geography={geo}
                onClick={(e) => handleClick(geo, e)}
                style={{
                  default: {
                    fill: geo.properties?.name === country
                      ? '#FF5722'
                      : '#ECEFF1',
                    outline: 'none',
                  },
                  hover: {
                    fill: '#CFD8DC',
                    cursor: 'pointer',
                    outline: 'none',
                  },
                  pressed: {
                    fill: '#B0BEC5',
                    outline: 'none',
                  },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};
