import React, { FC, ReactNode, useState, useEffect, useRef, useCallback } from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';

interface CutscenePlayerProps {
  content: ReactNode;
  onSkip: () => void;
  isVisible: boolean;
  onComplete?: () => void;
}

const CutscenePlayer: FC<CutscenePlayerProps> = ({ content, onSkip, isVisible, onComplete }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const skipTimeRequired = 3000; // 5 секунд для пропуска
  const progressStep = 20; // Обновляем прогресс каждые 20мс

  // Обработка нажатия клавиши F
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible) return;
      
      // Проверяем, что нажата клавиша F (код 70) независимо от языковой раскладки
      if (e.code === 'KeyF') {
        setIsHolding(true);
        startProgressTimer();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!isVisible) return;
      
      if (e.code === 'KeyF') {
        setIsHolding(false);
        stopProgressTimer();
        resetProgress();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      stopProgressTimer();
    };
  }, [isVisible]);

  // Сброс прогресса при скрытии компонента
  useEffect(() => {
    if (!isVisible) {
      resetProgress();
      setIsPaused(false);
      setIsHolding(false);
    }
  }, [isVisible]);

  // Обработчик завершения катсцены
  const handleComplete = useCallback(() => {
    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  // Запуск таймера для отслеживания прогресса
  const startProgressTimer = useCallback(() => {
    if (progressInterval.current) return;

    progressInterval.current = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + (progressStep / skipTimeRequired * 100);
        
        if (newProgress >= 100) {
          stopProgressTimer();
          onSkip();
          return 0;
        }
        
        return newProgress;
      });
    }, progressStep);
  }, [onSkip]);

  // Остановка таймера
  const stopProgressTimer = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  }, []);

  // Сброс прогресса
  const resetProgress = useCallback(() => {
    setProgress(0);
  }, []);

  // Обработчики для кнопки пропуска
  const handleSkipMouseDown = () => {
    setIsHolding(true);
    startProgressTimer();
  };

  const handleSkipMouseUp = () => {
    setIsHolding(false);
    stopProgressTimer();
    resetProgress();
  };

  // Обработчик клика по ролику для паузы
  const handleCutsceneClick = (e: React.MouseEvent) => {
    // Исключаем клик по кнопке пропуска
    if ((e.target as HTMLElement).closest(`.${styles.skipButton}`)) return;
    
    setIsPaused(!isPaused);
  };

  if (!isVisible) return null;

  return (
    <div className={styles.cutscenePlayer} onClick={handleCutsceneClick}>
      <div className={`${styles.content} ${isPaused ? styles.paused : ''}`}>
        {/* Передаем контенту состояние паузы и колбэк завершения */}
        {React.isValidElement(content) ? 
          React.cloneElement(content as React.ReactElement, { 
            onComplete: handleComplete,
            isPaused: isPaused 
          }) : 
          content
        }
        
        {/* Индикатор паузы */}
        <div className={`${styles.pauseIndicator} ${isPaused ? styles.visible : ''}`}>
          <div className={styles.pauseBars}>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
          </div>
        </div>
      </div>
      
      <div 
        className={classNames(
          styles.skipButton,
          { [styles.active]: isHolding },
          { [styles.visible]: isHolding }
        )}
        onMouseDown={handleSkipMouseDown}
        onMouseUp={handleSkipMouseUp}
        onMouseLeave={handleSkipMouseUp}
      >
        <div className={styles.progressRing}>
          <svg viewBox="0 0 36 36">
            <path
              className={styles.progressBg}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={styles.progressFill}
              strokeDasharray={`${progress}, 100`}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span className={styles.skipKey}>F</span>
        </div>
        <span className={styles.skipText}>skip</span>
      </div>
    </div>
  );
};

export default CutscenePlayer; 