import React, { useMemo } from 'react';
import { useAppSelector } from '../app/hooks';
import { selectActiveEvents } from '../app/gameSlice';
import { GameEvent } from './GameEvent';
import { GameEvent as GameEventType } from '../types';
import { GAME_EVENTS } from '../Events';

export const GameEvents: React.FC = () => {
  const activeEvents = useAppSelector(selectActiveEvents);
  
  const events = useMemo(() => {
    if (activeEvents.length === 0) {
      return [];
    }
    
    return activeEvents
      .map(eventObj => {
        if (eventObj.id === 'BUY_COUNTRY') {
          return null; 
        }
        
        const eventData = GAME_EVENTS[eventObj.id];
        if (!eventData) return null;
        
        // Создаем копию события с заданной позицией
        return {
          ...eventData,
          position: eventObj.position
        } as GameEventType;
      })
      .filter((event): event is GameEventType => event !== null);
  }, [activeEvents]);
  
  return (
    <div className="game-events-container">
      {events.map(event => (
        <GameEvent 
          key={`${event.id}-${Array.isArray(event.position) ? event.position.join(',') : 'random'}`} 
          event={event} 
        />
      ))}
    </div>
  );
}; 