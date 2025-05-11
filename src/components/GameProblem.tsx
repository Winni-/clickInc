import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch } from '../app/hooks';
import { clickProblem, resolveProblem, failProblem } from '../app/gameSlice';
import styles from './GameProblem.module.scss';
import { Problem } from '../types';

interface GameProblemProps {
  problem: Problem;
  projectId: string;
  startTime: number;
  position: number[];
}

export const GameProblem: React.FC<GameProblemProps> = ({ problem, projectId, startTime, position }) => {
  const dispatch = useAppDispatch();
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(problem.time);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Обработчик клика по проблеме
  const handleClick = () => {
    if (clicks < problem.amount) {
      const newClicks = clicks + 1;
      setClicks(newClicks);
      dispatch(clickProblem({ problemId: problem.id, projectId }));
      
      // Если достигли нужного количества кликов, отправляем событие успешного разрешения
      if (newClicks >= problem.amount) {
        dispatch(resolveProblem({ problemId: problem.id, projectId }));
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
    }
  };

  // Запуск таймера при монтировании компонента
  useEffect(() => {
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, problem.time - elapsed);
      setTimeLeft(remaining);

      // Если время вышло, отправляем событие неудачи проекта
      if (remaining <= 0) {
        dispatch(failProblem({ problemId: problem.id, projectId }));
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
    }, 100);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [dispatch, problem.id, problem.time, projectId, startTime]);

  // Определяем координаты для отображения проблемы
  const getPositionStyle = () => {
    return {
      left: `${position[0]}px`,
      top: `${position[1]}px`
    };
  };

  // Процент выполнения для прогресс-бара
  const progressPercent = (clicks / problem.amount) * 100;
  const timePercent = (timeLeft / problem.time) * 100;

  return (
    <div 
      className={styles.gameProblem} 
      style={getPositionStyle()}
      onClick={handleClick}
    >
      <div className={styles.timerBar}>
        <div className={styles.timerFill} style={{ width: `${timePercent}%` }} />
      </div>
      <div className={styles.icon}>{problem.icon}</div>
      <div className={styles.tooltip}>{problem.description}</div>
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
      </div>
    </div>
  );
}; 