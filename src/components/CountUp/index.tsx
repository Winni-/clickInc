import React, { useEffect, useState, useRef } from 'react';
import styles from './index.module.scss';

interface CountUpProps {
  value: number;
  duration?: number; // длительность анимации в мс
  decimals?: number; // количество знаков после запятой
  prefix?: string; // префикс перед числом (например "$")
  suffix?: string; // суффикс после числа (например "₿")
  className?: string;
  showColors?: boolean; // показывать ли цветом рост/падение значения
}

const CountUp: React.FC<CountUpProps> = ({
  value,
  duration = 500,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  showColors = false,
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValue = useRef(value);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const isIncreasing = value > previousValue.current;

  useEffect(() => {
    // Если значение не изменилось, не запускаем анимацию
    if (previousValue.current === value) return;

    // Сохраняем начальное значение
    const startValue = previousValue.current;
    
    // Обновляем предыдущее значение
    previousValue.current = value;
    
    // Отмена предыдущей анимации, если она запущена
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Функция анимации
    const animateValue = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      
      const elapsed = timestamp - startTimeRef.current;
      
      // Коэффициент прогресса (от 0 до 1)
      const progress = Math.min(elapsed / duration, 1);
      
      // Рассчитываем текущее значение для отображения
      const currentValue = startValue + (value - startValue) * progress;
      
      // Обновляем отображаемое значение
      setDisplayValue(currentValue);
      
      // Если анимация не завершена, продолжаем
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateValue);
      } else {
        // Сбрасываем ссылки после завершения
        startTimeRef.current = undefined;
        animationRef.current = undefined;
      }
    };
    
    // Запускаем анимацию
    animationRef.current = requestAnimationFrame(animateValue);
    
    // Очистка при размонтировании
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  // Форматируем число с нужным количеством знаков после запятой
  const formattedValue = displayValue.toFixed(decimals);
  
  // Определяем классы стилей на основе параметров и изменения значения
  const colorClass = showColors && value !== previousValue.current 
    ? isIncreasing ? styles.positive : styles.negative 
    : '';
  
  return (
    <span className={`${styles.countUp} ${colorClass} ${className}`}>
      {prefix}{formattedValue}{suffix}
    </span>
  );
};

export default CountUp; 