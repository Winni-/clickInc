import React, { FC, useEffect, useRef } from 'react';
import styles from './Cutscenes.module.scss';

// Глобальные переменные для хранения состояния между ремаунтами
const transitionState = {
  startTime: Date.now(),
  completed: false,
  paused: false,
  pauseStart: 0,
  totalPausedTime: 0
};

interface StageTransitionCutsceneProps {
  targetStage: number;
  onComplete?: () => void;
  isPaused?: boolean;
}

const StageTransitionCutscene: FC<StageTransitionCutsceneProps> = ({ 
  targetStage, 
  onComplete,
  isPaused = false
}) => {
  const completeTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Константа для времени завершения
  const TOTAL_DURATION = 15000; // 15 секунд до завершения
  
  // Обработка паузы и ремаунта
  useEffect(() => {
    // Обработка изменения статуса паузы
    if (isPaused !== transitionState.paused) {
      if (isPaused) {
        // Начинаем паузу
        transitionState.paused = true;
        transitionState.pauseStart = Date.now();
        
        // Очищаем активные таймеры
        if (completeTimerRef.current) {
          clearTimeout(completeTimerRef.current);
          completeTimerRef.current = null;
        }
      } else {
        // Заканчиваем паузу
        if (transitionState.pauseStart > 0) {
          transitionState.totalPausedTime += Date.now() - transitionState.pauseStart;
          transitionState.pauseStart = 0;
        }
        transitionState.paused = false;
        
        // Планируем следующие шаги
        planNextSteps();
      }
    } else if (!isPaused && !transitionState.completed) {
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
    const effectiveElapsed = now - transitionState.startTime - transitionState.totalPausedTime;
    
    // Планируем завершение, если оно еще не произошло
    if (!transitionState.completed) {
      const timeToComplete = Math.max(0, TOTAL_DURATION - effectiveElapsed);
      
      if (timeToComplete <= 0) {
        // Если время уже прошло, завершаем немедленно
        if (onComplete && !transitionState.completed) {
          onComplete();
          transitionState.completed = true;
        }
      } else if (!completeTimerRef.current) {
        // Иначе устанавливаем таймер на оставшееся время
        completeTimerRef.current = setTimeout(() => {
          if (onComplete) {
            onComplete();
            transitionState.completed = true;
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
      if (!document.querySelector(`.${styles.transitionCutscene}`)) {
        // Сбрасываем состояние для следующего использования
        transitionState.startTime = Date.now();
        transitionState.completed = false;
        transitionState.paused = false;
        transitionState.pauseStart = 0;
        transitionState.totalPausedTime = 0;
      }
    };
  }, []);

  // Разные тексты в зависимости от этапа
  const getStageContent = () => {
    switch (targetStage) {
      case 2:
        return {
          title: 'Объединение Земли',
          //TODO: описание в зависимости от того что в state.secondStage
          description: 'Под вашим руководством человечество объединилось. Теперь можно сосредоточить усилия на подготовке к космической угрозе.',
        };
      case 3:
        return {
          title: 'Финальное противостояние',
          description: 'Человечество готово к решающей битве. Наши технологии против инопланетной угрозы.',
        };
      default:
        return {
          title: 'Переход к новому этапу',
          description: 'Вы достигли значительного прогресса. Впереди новые вызовы.',
        };
    }
  };

  const content = getStageContent();

  return (
    <div className={`${styles.transitionCutscene} ${isPaused ? styles.paused : ''}`}>
      <div className={styles.content}>
        <h1 className={styles.title}>{content.title}</h1>
        <p className={styles.description}>{content.description}</p>
        <div className={styles.animationContainer}>
          <div className={styles.rod}></div>
          <div className={styles.placeholder}>
            [Анимация для этапа {targetStage} будет добавлена позже]
          </div>
        </div>
      </div>
    </div>
  );
};

export default StageTransitionCutscene; 