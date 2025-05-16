import React, { useMemo } from 'react';
import styles from './Ship.module.scss';

interface ShipProps {
  progress: number; // от 0 до 100
  className?: string;
}

const Ship: React.FC<ShipProps> = ({ progress, className }) => {
  // Ограничиваем прогресс от 0 до 100
  const normalizedProgress = useMemo(() => {
    return Math.max(0, Math.min(100, progress));
  }, [progress]);
  
  // Рассчитываем координаты на основе прогресса
  const position = useMemo(() => {
    // Начальная и конечная точки
    const startX = 5; // % от ширины родителя
    const startY = 90; // % от высоты родителя
    const endX = 95; // % от ширины родителя
    const endY = 5; // % от высоты родителя
    
    // Контрольная точка для квадратичной кривой Безье (искривление дуги)
    const controlX = 25; // % от ширины родителя
    const controlY = 20; // % от высоты родителя
    
    // Параметр t для кривой Безье (0 <= t <= 1)
    const t = normalizedProgress / 100;
    
    // Квадратичная кривая Безье: B(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
    // где P₀ - начальная точка, P₁ - контрольная точка, P₂ - конечная точка
    const x = Math.pow(1 - t, 2) * startX + 2 * (1 - t) * t * controlX + Math.pow(t, 2) * endX;
    const y = Math.pow(1 - t, 2) * startY + 2 * (1 - t) * t * controlY + Math.pow(t, 2) * endY;
    
    return { x, y };
  }, [normalizedProgress]);
  
  // Рассчитываем угол наклона ракеты
  const rotation = useMemo(() => {
    // Начинаем с 45 градусов и заканчиваем 0 градусов с небольшой кривой
    return 45 - (normalizedProgress / 100) * 65;
  }, [normalizedProgress]);

  return (
    <div 
      className={`${styles.shipContainer} ${className || ''}`}
      style={{ 
        left: `${position.x}%`, 
        top: `${position.y}%`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`
      }}
    >
      <div className={styles.ship}>🚀</div>
    </div>
  );
};

export default Ship; 