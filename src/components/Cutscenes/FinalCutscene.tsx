import React, { FC, useEffect, useRef } from 'react';
import styles from './Cutscenes.module.scss';

// Глобальные переменные для хранения состояния между ремаунтами
const finalState = {
  startTime: Date.now(),
  completed: false,
  paused: false,
  pauseStart: 0,
  totalPausedTime: 0
};

interface FinalCutsceneProps {
  onComplete?: () => void;
  isPaused?: boolean;
}

const FinalCutscene: FC<FinalCutsceneProps> = ({ onComplete, isPaused = false }) => {
  const completeTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Константа для времени завершения
  const TOTAL_DURATION = 25000; // 25 секунд до завершения
  
  // Обработка паузы и ремаунта
  useEffect(() => {
    // Обработка изменения статуса паузы
    if (isPaused !== finalState.paused) {
      if (isPaused) {
        // Начинаем паузу
        finalState.paused = true;
        finalState.pauseStart = Date.now();
        
        // Очищаем активные таймеры
        if (completeTimerRef.current) {
          clearTimeout(completeTimerRef.current);
          completeTimerRef.current = null;
        }
      } else {
        // Заканчиваем паузу
        if (finalState.pauseStart > 0) {
          finalState.totalPausedTime += Date.now() - finalState.pauseStart;
          finalState.pauseStart = 0;
        }
        finalState.paused = false;
        
        // Планируем следующие шаги
        planNextSteps();
      }
    } else if (!isPaused && !finalState.completed) {
      // Планируем следующие шаги при первом монтировании или ремаунте без паузы
      planNextSteps();
    }
    
    return () => {
      // Очищаем таймеры при размонтировании
      if (completeTimerRef.current) {
        clearTimeout(completeTimerRef.current);
        completeTimerRef.current = null;
      }
    };
  }, [isPaused, onComplete]);
  
  // Функция для планирования следующих шагов
  const planNextSteps = () => {
    const now = Date.now();
    const effectiveElapsed = now - finalState.startTime - finalState.totalPausedTime;
    
    // Планируем завершение, если оно еще не произошло
    if (!finalState.completed) {
      const timeToComplete = Math.max(0, TOTAL_DURATION - effectiveElapsed);
      
      if (timeToComplete <= 0) {
        // Если время уже прошло, завершаем немедленно
        if (onComplete && !finalState.completed) {
          onComplete();
          finalState.completed = true;
        }
      } else if (!completeTimerRef.current) {
        // Иначе устанавливаем таймер на оставшееся время
        completeTimerRef.current = setTimeout(() => {
          if (onComplete) {
            onComplete();
            finalState.completed = true;
          }
          completeTimerRef.current = null;
        }, timeToComplete);
      }
    }
  };
  
  // Сброс состояния при настоящем размонтировании компонента
  useEffect(() => {
    return () => {
      // Только если это настоящее размонтирование, а не обновление
      if (!document.querySelector(`.${styles.finalCutscene}`)) {
        // Сбрасываем состояние для следующего использования
        finalState.startTime = Date.now();
        finalState.completed = false;
        finalState.paused = false;
        finalState.pauseStart = 0;
        finalState.totalPausedTime = 0;
      }
    };
  }, []);

  return (
    <div className={`${styles.finalCutscene} ${isPaused ? styles.paused : ''}`}>
      <div className={styles.content}>
        <h1 className={styles.title}>Победа человечества</h1>
        <p className={styles.description}>
          Благодаря вашему руководству, человечество смогло отразить инопланетную угрозу.
          Земля теперь готова к новой эре космической экспансии.
        </p>
        <div className={styles.animationContainer}>
          {/* Здесь будет размещена анимация для финального ролика */}
          <div className={styles.placeholder}>
            [Финальная анимация будет добавлена позже]
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalCutscene; 