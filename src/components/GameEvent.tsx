import React from 'react';
import { useAppDispatch } from '../app/hooks';
import { resolveEvent } from '../app/gameSlice';
import styles from './GameEvent.module.scss';
import { GameEvent as GameEventType } from '../types';

interface GameEventProps {
  event: GameEventType;
}

export const GameEvent: React.FC<GameEventProps> = ({ event }) => {
  const dispatch = useAppDispatch();

  // Обработчик клика по событию
  const handleClick = () => {
    dispatch(resolveEvent(event.id));
  };
  
  // Определяем координаты для отображения события
  const getPositionStyle = () => {
    if (Array.isArray(event.position)) {
      return {
        left: `${event.position[0]}px`,
        top: `${event.position[1]}px`
      };
    }
    
    // Если позиция не определена или равна "random", 
    // возвращаем стандартное положение в центре экрана
    return {
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)'
    };
  };
  
  return (
    <div 
      className={styles.gameEvent} 
      style={getPositionStyle()}
      onClick={handleClick}
    >
      <div className={styles.icon}>{event.icon}</div>
      <div className={styles.tooltip}>{event.message}</div>
    </div>
  );
}; 