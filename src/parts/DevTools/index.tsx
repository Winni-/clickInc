import React from 'react';
import styles from './index.module.scss';
import { resetGame, updateResources } from '../../app/gameSlice';
import { useAppDispatch } from '../../app/hooks';
import { COMMON, ECONOMY, SCIENCE, FAITH  } from '../../app/constants';

export const DevTools = () => {
  const dispatch = useAppDispatch();
  
  const handleAddResources = (resource: string) => {
    dispatch(updateResources({
      delta: 10000,
      resources: { [resource]: 10000 }
    }));
  };
  
  return <div className={styles.devTools}>
    <button onClick={() => dispatch(resetGame())}>Сбросить игру</button>
    <button onClick={() => handleAddResources(COMMON)}>10000 ресурсов</button>
    <button onClick={() => handleAddResources(ECONOMY)}>10000 экономики</button>
    <button onClick={() => handleAddResources(SCIENCE)}>10000 науки</button>
    <button onClick={() => handleAddResources(FAITH)}>10000 веры</button>
  </div>;
};
