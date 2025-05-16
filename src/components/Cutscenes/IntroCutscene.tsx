import React, { FC, useEffect, useState, useRef } from 'react';
import styles from './Cutscenes.module.scss';
import intro from '../../assets/oumua.jpg';
import explosion from '../../assets/Pluton.jpg';

// Глобальные переменные для хранения состояния между ремаунтами
// Это НЕ хранилище таймеров, а только состояние для одного компонента
const introState = {
  startTime: Date.now(),
  firstScreenShown: false,
  completed: false,
  paused: false,
  pauseStart: 0,
  totalPausedTime: 0
};

interface IntroCutsceneProps {
  onComplete?: () => void;
  isPaused?: boolean;
}

const IntroCutscene: FC<IntroCutsceneProps> = ({ onComplete, isPaused = false }) => {
  const [showSecond, setShowSecond] = useState(introState.firstScreenShown);
  const cutsceneRef = useRef<HTMLDivElement>(null);
  const firstTimerRef = useRef<NodeJS.Timeout | null>(null);
  const completeTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Константы для времени
  const FIRST_SCREEN_DURATION = 10000; // 10 секунд до смены экрана
  const TOTAL_DURATION = 20000; // 20 секунд до завершения
  
  // Обработка паузы и ремаунта
  useEffect(() => {
    // Обновляем показ второго экрана при первом монтировании
    if (introState.firstScreenShown && !showSecond) {
      setShowSecond(true);
    }
    
    // Обработка изменения статуса паузы
    if (isPaused !== introState.paused) {
      if (isPaused) {
        // Начинаем паузу
        introState.paused = true;
        introState.pauseStart = Date.now();
        
        // Очищаем активные таймеры
        if (firstTimerRef.current) {
          clearTimeout(firstTimerRef.current);
          firstTimerRef.current = null;
        }
        
        if (completeTimerRef.current) {
          clearTimeout(completeTimerRef.current);
          completeTimerRef.current = null;
        }
      } else {
        // Заканчиваем паузу
        if (introState.pauseStart > 0) {
          introState.totalPausedTime += Date.now() - introState.pauseStart;
          introState.pauseStart = 0;
        }
        introState.paused = false;
        
        // Планируем следующие шаги
        planNextSteps();
      }
    } else if (!isPaused && !introState.completed) {
      // Планируем следующие шаги при первом монтировании или ремаунте без паузы
      planNextSteps();
    }
    
    return () => {
      // Очищаем таймеры при размонтировании
      if (firstTimerRef.current) {
        clearTimeout(firstTimerRef.current);
        firstTimerRef.current = null;
      }
      
      if (completeTimerRef.current) {
        clearTimeout(completeTimerRef.current);
        completeTimerRef.current = null;
      }
    };
  }, [isPaused, onComplete]);
  
  // Функция для планирования следующих шагов (смена экрана, завершение)
  const planNextSteps = () => {
    const now = Date.now();
    const effectiveElapsed = now - introState.startTime - introState.totalPausedTime;
    
    // Планируем смену экрана, если она еще не произошла
    if (!introState.firstScreenShown) {
      const timeToFirstScreen = Math.max(0, FIRST_SCREEN_DURATION - effectiveElapsed);
      
      if (timeToFirstScreen <= 0) {
        // Если время уже прошло, меняем экран немедленно
        if (!showSecond) {
          setShowSecond(true);
          introState.firstScreenShown = true;
        }
      } else if (!firstTimerRef.current) {
        // Иначе устанавливаем таймер на оставшееся время
        firstTimerRef.current = setTimeout(() => {
          setShowSecond(true);
          introState.firstScreenShown = true;
          firstTimerRef.current = null;
        }, timeToFirstScreen);
      }
    }
    
    // Планируем завершение, если оно еще не произошло
    if (!introState.completed) {
      const timeToComplete = Math.max(0, TOTAL_DURATION - effectiveElapsed);
      
      if (timeToComplete <= 0) {
        // Если время уже прошло, завершаем немедленно
        if (onComplete && !introState.completed) {
          onComplete();
          introState.completed = true;
        }
      } else if (!completeTimerRef.current) {
        // Иначе устанавливаем таймер на оставшееся время
        completeTimerRef.current = setTimeout(() => {
          if (onComplete) {
            onComplete();
            introState.completed = true;
          }
          completeTimerRef.current = null;
        }, timeToComplete);
      }
    }
  };

  // Эффект параллакса при движении мыши
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cutsceneRef.current || isPaused) return; // Отключаем параллакс при паузе
      
      const elements = cutsceneRef.current.querySelectorAll(`.${styles.parallaxElement}`);
      const boundingRect = cutsceneRef.current.getBoundingClientRect();
      
      // Рассчитываем центр элемента
      const centerX = boundingRect.left + boundingRect.width / 2;
      const centerY = boundingRect.top + boundingRect.height / 2;
      
      // Рассчитываем смещение от центра
      const offsetX = (e.clientX - centerX) / 25;
      const offsetY = (e.clientY - centerY) / 25;
      
      // Применяем разные значения смещения для разных элементов
      elements.forEach((element, index) => {
        const multiplier = (index + 1) * 0.8;
        const x = offsetX * multiplier;
        const y = offsetY * multiplier;
        
        (element as HTMLElement).style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isPaused]);

  // Сброс состояния при размонтировании компонента приложения
  useEffect(() => {
    return () => {
      // Только если это настоящее размонтирование, а не обновление
      if (!document.querySelector(`.${styles.introCutscene}`)) {
        // Сбрасываем состояние для следующего использования
        introState.startTime = Date.now();
        introState.firstScreenShown = false;
        introState.completed = false;
        introState.paused = false;
        introState.pauseStart = 0;
        introState.totalPausedTime = 0;
      }
    };
  }, []);

  return (
    <div 
      ref={cutsceneRef}
      className={`${styles.introCutscene} ${showSecond ? styles.showSecond : ''} ${isPaused ? styles.paused : ''}`}
    >
      <div className={styles.firstScreen}>
        {/* Элементы для параллакса */}
        <div className={`${styles.parallaxElement} ${styles.element1}`}></div>
        <div className={`${styles.parallaxElement} ${styles.element2}`}></div>
        <div className={`${styles.parallaxElement} ${styles.element3}`}></div>
        
        <p className={styles.description}>
          19 октября 2017 Robert Weryk открыл комету Oumuamua, первый межзвездный объект, что пролетел солнечную систему. Состав кометы нам не известен, является ли она искусственным объектом, неизвестно.
        </p>
      </div>
      <div className={styles.secondScreen}>
        {/* Элементы для параллакса */}
        <div className={`${styles.parallaxElement} ${styles.element1}`}></div>
        <div className={`${styles.parallaxElement} ${styles.element2}`}></div>
        <div className={`${styles.parallaxElement} ${styles.element3}`}></div>
        
        <p className={styles.description}>
          15 мая 2026 года, в 04:45:15, небо озарила вспышка. Плутон был уничтожен, ничего не было детектировано нашими современыми приборами. Всем стало ясно, что наши земные проблемы уже ничего не значат и нам требуется объедениться, чтобы противостоять внеземной угрозе.
        </p>
      </div>
    </div>
  );
};

export default IntroCutscene; 