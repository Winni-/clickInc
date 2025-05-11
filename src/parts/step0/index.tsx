import React, { useEffect, useState } from 'react';
import { Feature } from 'geojson';
import { CountryMap } from '../map/CountryMap';
import styles from './index.module.scss';

interface Step0Props {
  isSelected?: boolean;
}

export const Step0 = ({ isSelected = false }: Step0Props) => {

  return (
    <div className={`step0 ${styles.step0} ${isSelected ? styles.selected : ''}`}>
      <header className={styles.header}>Выберите страну</header>
      <div className={styles.mapContainer}>
        <CountryMap visible={true}/>
      </div>
    </div>
  );
}; 