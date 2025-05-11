import React, { useState, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectActiveNews, hideNews } from '../app/gameSlice';
import { News } from '../News';
import { NEWS_DISPLAY_TIME } from '../app/constants';
import styles from './NewsDisplay.module.scss';

export const NewsDisplay: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeNewsId = useAppSelector(selectActiveNews);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Эффект для отображения новости и запуска таймера скрытия
  useEffect(() => {
    if (activeNewsId) {
      setIsVisible(true);
      
      // Запускаем таймер для автоматического скрытия
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      timerRef.current = setTimeout(() => {
        if (!isHovered) {
          setIsVisible(false);
          dispatch(hideNews());
        }
      }, NEWS_DISPLAY_TIME);
    } else {
      setIsVisible(false);
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [activeNewsId, isHovered, dispatch]);
  
  // При наведении мыши останавливаем таймер
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };
  
  // При уводе мыши запускаем таймер снова
  const handleMouseLeave = () => {
    setIsHovered(false);
    if (activeNewsId) {
      timerRef.current = setTimeout(() => {
        setIsVisible(false);
        dispatch(hideNews());
      }, NEWS_DISPLAY_TIME);
    }
  };
  
  // Обработчик клика по новости для закрытия
  const handleClick = () => {
    setIsVisible(false);
    dispatch(hideNews());
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };
  
  if (!activeNewsId) {
    return null;
  }
  
  const newsItem = News[activeNewsId];
  if (!newsItem) return null;
  
  // Определяем класс в зависимости от этапа новости
  const getStageClass = () => {
    if (newsItem.stage === 0) return styles.stageZero;
    if (newsItem.stage === 1) return styles.stageOne;
    if (newsItem.stage === 2) return styles.stageTwo;
    if (newsItem.stage === 'special') return styles.stageSpecial;
    return '';
  };
  
  // Добавляем декоративные элементы для стиля
  const formatText = (text: string) => {
    // Выделяем некоторые ключевые слова для подчеркивания важности
    const highlightKeywords = (str: string) => {
      const keywords = ['прогресс', 'империя', 'мир', 'проект', 'наука', 'будущее', 'союз', 'планета', 'космос', 'фанатики', 'страна', 'талант', 'технологии', 'могущество', 'господство'];
      let result = str;
      
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        result = result.replace(regex, match => `<span class="${styles.highlight}">${match}</span>`);
      });
      
      return result;
    };
    
    return (
      <span dangerouslySetInnerHTML={{ __html: highlightKeywords(text) }} />
    );
  };
  
  return (
    <div 
      className={`${styles.newsContainer} ${isVisible ? styles.visible : ''} ${getStageClass()}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {formatText(newsItem.text)}
    </div>
  );
}; 