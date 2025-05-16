import React, { FC, useEffect, useState, useRef } from 'react';
import styles from './Cutscenes.module.scss';

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
  const animationFrameRef = useRef<number | null>(null);
  const animationStartTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  
  // Константы для времени
  const FIRST_SCREEN_DURATION = 10000; // 10 секунд до смены экрана
  const TOTAL_DURATION = 20000; // 20 секунд до завершения
  const PARALLAX_ANIMATION_DURATION = 10000; // 10 секунд для полной анимации параллакса
  
  // Функция для запуска и обновления анимации параллакса
  const startParallaxAnimation = () => {
    // Сначала очищаем предыдущую анимацию, если она есть
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Сбрасываем время начала анимации
    animationStartTimeRef.current = Date.now() - pausedTimeRef.current;
    
    const updateParallax = () => {
      if (!cutsceneRef.current || isPaused) {
        return;
      }
      
      const now = Date.now();
      const elapsedTime = now - animationStartTimeRef.current;
      
      // Рассчитываем прогресс анимации от 0 до 1 за 10 секунд
      // Полный цикл = 20 секунд (10 секунд туда, 10 секунд обратно)
      // Используем Math.floor для определения текущего цикла
      const fullCycleDuration = PARALLAX_ANIMATION_DURATION * 2;
      const cycleTime = elapsedTime % fullCycleDuration;
      
      // Определяем направление движения (первые 10 секунд - прямое, вторые 10 - обратное)
      let normalizedProgress: number;
      if (cycleTime < PARALLAX_ANIMATION_DURATION) {
        // Движение в прямом направлении (0 -> 1) за первые 10 секунд
        normalizedProgress = cycleTime / PARALLAX_ANIMATION_DURATION;
      } else {
        // Движение в обратном направлении (1 -> 0) за следующие 10 секунд
        normalizedProgress = (fullCycleDuration - cycleTime) / PARALLAX_ANIMATION_DURATION;
      }
      
      // Определяем текущий экран
      const screenSelector = showSecond ? `.${styles.secondScreen}` : `.${styles.firstScreen}`;
      const elements = cutsceneRef.current.querySelectorAll(`${screenSelector} .${styles.parallaxElement}`);
      
      // Максимальные смещения
      const maxOffsetX = 100;
      const maxOffsetY = 50;
      
      // Применяем разные значения смещения для разных элементов
      elements.forEach((element, index) => {
        // Для четных индексов движение вниз-вправо, для нечетных - вверх-влево
        const direction = index % 2 === 0 ? 1 : -1;
        const multiplier = (index + 1) * 0.8;
        
        // Вычисляем текущие координаты для смещения
        const x = direction * normalizedProgress * maxOffsetX * multiplier;
        const y = direction * normalizedProgress * maxOffsetY * multiplier;
        
        (element as HTMLElement).style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
      
      // Запланировать следующий кадр анимации
      animationFrameRef.current = requestAnimationFrame(updateParallax);
    };
    
    // Запускаем анимацию
    animationFrameRef.current = requestAnimationFrame(updateParallax);
  };
  
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
        
        // Останавливаем анимацию параллакса
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
          
          // Запоминаем временную позицию анимации
          pausedTimeRef.current = Date.now() - animationStartTimeRef.current;
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
        
        // Возобновляем анимацию параллакса
        if (!animationFrameRef.current) {
          startParallaxAnimation();
        }
      }
    } else if (!isPaused && !introState.completed) {
      // Планируем следующие шаги при первом монтировании или ремаунте без паузы
      planNextSteps();
      
      // Запускаем анимацию параллакса при первом монтировании
      if (!animationFrameRef.current) {
        startParallaxAnimation();
      }
    }
    
    return () => {
      // Очищаем таймеры и анимации при размонтировании
      if (firstTimerRef.current) {
        clearTimeout(firstTimerRef.current);
        firstTimerRef.current = null;
      }
      
      if (completeTimerRef.current) {
        clearTimeout(completeTimerRef.current);
        completeTimerRef.current = null;
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isPaused]);
  
  // Эффект для отслеживания изменения экрана и обновления анимации
  useEffect(() => {
    // Перезапускаем анимацию при смене экрана
    if (!isPaused) {
      startParallaxAnimation();
    }
  }, [showSecond]);

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