import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from './index.module.scss';
import { useSpring, animated, useTransition } from '@react-spring/web';
import {
  manualClick,
  selectManualClickPower,
  selectResources,
  selectSpheres,
  selectedCountry,
} from "../../app/gameSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Shop } from "./shop";
import { Feature } from "geojson";
import { CountryMap } from "../map/CountryMap";
import { GOLD_COLORS } from "../../constants";
import TalentTree from "../../components/TalentTree";
import Projects from '../../components/Projects';
import CountUp from '../../components/CountUp';
import ResourcesHeader from "../../components/ResourcesHeader";

// Компонент тултипа
const Tooltip = ({ text }: { text: string }) => {
  return (
    <div className={styles.tooltip}>
      {text}
    </div>
  );
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

interface InterfaceProps {
  geo: Feature | null;
  clickPosition: { x: number; y: number } | null;
  isVisible?: boolean;
}

export const Step1 = ({ geo, clickPosition, isVisible = false }: InterfaceProps) => {
  const dispatch = useAppDispatch();
  const resources = useAppSelector(selectResources);
  const spheres = useAppSelector(selectSpheres);
  const selectedCountryName = useAppSelector(selectedCountry);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const coinsContainerRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const manualClickPower = useAppSelector(selectManualClickPower);
  const particles = useRef<Particle[]>([]);
  const [coins, setCoins] = useState<{ x: number; y: number; id: number }[]>([]);
  const [isClicking, setIsClicking] = useState(false);
  const [nextCoinId, setNextCoinId] = useState(0);
  const [finishedLoading, setFinishedLoading] = useState(false);
  // Анимация текста "+1₿"
  const transitions = useTransition(coins, {
    from: { opacity: 1, transform: 'translateY(0px)' },
    enter: { opacity: 0, transform: 'translateY(-50px)' },
    config: { duration: 1000 },
    keys: item => item.id,
    onRest: (result, ctrl, item) => {
      setCoins(current => current.filter(coin => coin.id !== item.id));
    },
  });

  // Инициализация частиц
  const initParticles = (x: number, y: number) => {
    // Очистить старые частицы
    particles.current = [];
    
    // Преобразование клиентских координат в координаты canvas
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const canvasX = x - rect.left;
      const canvasY = y - rect.top;
      
      // Создаем новые частицы
      for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2; // Угол в радианах (360 градусов)
        const speed = 0.1 + Math.random() * 1; // Случайная скорость
        
      particles.current.push({
          x: canvasX,
          y: canvasY,
          vx: Math.cos(angle) * speed, // Вычисляем составляющую скорости по X
          vy: Math.sin(angle) * speed, // Вычисляем составляющую скорости по Y
          life: 2, // Начальное время жизни
          color: GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)],
          size: 1 + Math.random() * 2 // Увеличиваем размер для лучшей видимости
        });
      }

    }
  };

  // Отрисовка частиц
  const drawParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Очищаем весь canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Если частиц нет, не продолжаем
    if (particles.current.length === 0) {
      requestAnimationFrame(drawParticles);
      return;
    }

    particles.current = particles.current.filter(p => {
      // Обновляем позицию
      p.x += p.vx;
      p.y += p.vy;
      
      // Добавляем небольшое замедление
      p.vx *= 0.98;
      p.vy *= 0.98;
      
      // Уменьшаем время жизни (медленнее)
      p.life -= 0.01;

      // Рисуем частицу, если она еще жива
      if (p.life > 0) {
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life; // Прозрачность зависит от времени жизни
        
        // Рисуем круг
      ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

        // Восстанавливаем контекст
        ctx.restore();
      }

      // Сохраняем частицу, пока она жива
      return p.life > 0;
    });

    requestAnimationFrame(drawParticles);
  }, []);

  // Обработчик клика по стране
  const handleCountryClick = (geo: Feature, pos: { x: number; y: number }) => {
    setIsClicking(true);
    setTimeout(() => setIsClicking(false), 100);
    
    const coinsContainer = coinsContainerRef.current?.getBoundingClientRect();
    if (!coinsContainer) return;
    
    dispatch(manualClick());

    // Создаем монетку на месте клика
    const coinPos = { 
      x: pos.x - coinsContainer.left, 
      y: pos.y - coinsContainer.top - 15, 
      id: nextCoinId 
    };

    setCoins(prev => [...prev, coinPos]);
    setNextCoinId(prev => prev + 1);
    
    // Инициализируем частицы, используя оригинальные координаты клика
    initParticles(pos.x, pos.y);
  };

  // Запуск анимации частиц
  useEffect(() => {
    const animationId = requestAnimationFrame(drawParticles);
    return () => cancelAnimationFrame(animationId);
  }, [drawParticles]);

  // Задать размеры canvas при монтировании и изменении размера окна
  useEffect(() => {
    const updateCanvasSize = () => {
      const canvas = canvasRef.current;
      const container = mapContainerRef.current;
      if (canvas && container) {
        // Получаем размеры контейнера
        const { width, height } = container.getBoundingClientRect();
        
        // Устанавливаем размеры canvas равными размерам контейнера
        canvas.width = width;
        canvas.height = height;
        
        console.log("Canvas resized to:", width, height);
      }
    };

    // Обновляем размер при монтировании
    updateCanvasSize();
    
    // Обновляем размер при изменении окна
    window.addEventListener('resize', updateCanvasSize);
    
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setFinishedLoading(true);
    }, 1000);
  }, []);

  return (
    <div className={`step1 ${styles.step1} ${isVisible ? styles.visible : ''}`}>
    <header className={styles.header}>
      <ResourcesHeader />
    </header>
    <div className={styles.development}>
      <header className={styles.header}>Развитие</header>
      <TalentTree />
    </div>
    <div className={styles.mapContainer} ref={mapContainerRef}>
      {selectedCountryName && (
        <>
          <CountryMap
            onCountryClick={handleCountryClick}
            showOnlySelected={false}
            scale={1}
            className={isClicking ? styles.clicking : ''}
            visible={finishedLoading}
            allowConquest={true}
          />
          <canvas
            ref={canvasRef}
            className={styles.particlesCanvas}
            style={{ zIndex: 10 }}
          />
          {/* Анимации монеток */}
          <div ref={coinsContainerRef} className={styles.coinsContainer}>
            {transitions((style, item) => (
              <animated.div
                style={{
                  ...style,
                  position: 'absolute',
                  left: `${item.x}px`,
                  top: `${item.y}px`,
                  transform: style.transform,
                  pointerEvents: 'none',
                  fontSize: '16px',
                  color: '#FFD700',
                  fontWeight: 'bold',
                  textShadow: '0 0 3px rgba(0,0,0,0.5)',
                  zIndex: 1000,
                }}
              >
                +{Math.round(manualClickPower)}₿
              </animated.div>
            ))}
          </div>
        </>
      )}
    </div>
    <div className={styles.projects}>
      <header className={styles.header}>Проекты</header>
      <Projects />
    </div>
    <div className={styles.upgrades}>
      <header className={styles.header}>
        Улучшения
        <div className={styles.tooltipContainer}>
          <span className={styles.infoIcon}>ⓘ</span>
          <Tooltip text="Улучшайте свои инструменты. Здесь улучшения ваших кликов, автоматические клики и автоматические клики для определенной сферы. У каждого улучшения доход указан как число, что будет добавлено к уже имеющемуся значению." />
        </div>
      </header>
      <Shop />
    </div>
    </div>
  );
};
