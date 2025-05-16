import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectGame, selectSpheres, selectTalents } from '../../app/gameSlice';
import styles from './index.module.scss';
import { TALENTS } from '../../Talents';
import classnames from 'classnames';
import { Talent as TalentType } from '../../types';
import TalentTooltip from './TalentTooltip';

// New action type for activating talents
interface ActivateTalentAction {
  type: 'game/activateTalent';
  payload: string;
}

// Interface for tooltip data
interface TooltipData {
  isVisible: boolean;
  talentId: string;
  position: { x: number; y: number };
  boundaryAdjustment: 'left' | 'right' | 'center'; // позиция для корректировки стрелки
}

// Получение категории таланта для тултипа
const getCategoryClass = (category: string): string => {
  if (category === 'economy') return styles.economy;
  if (category === 'science') return styles.science;
  if (category === 'faith') return styles.faith;
  return '';
};

// Talent component to render individual talents
const Talent: React.FC<{
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  position: [number, number];
  isVisible: boolean;
  isActive: boolean;
  isLocked: boolean;
  onClick: () => void;
  dependencyLinks?: Array<[number, number]>;
  onShowTooltip: (talentId: string, e: React.MouseEvent) => void;
  onHideTooltip: () => void;
}> = ({ 
  id, 
  name,
  description,
  category,
  icon, 
  position, 
  isVisible, 
  isActive, 
  isLocked,
  onClick,
  dependencyLinks,
  onShowTooltip,
  onHideTooltip
}) => {
  if (!isVisible) return null;

  const talentStyle = {
    gridColumn: position[0],
    gridRow: 51 - position[1],
  };
  
  const talentClasses = classnames(
    styles.talent,
    { [styles.active]: isActive },
    { [styles.locked]: isLocked },
    { [styles.unlocked]: !isLocked }
  );

  return (
    <>
      {/* Draw dependency lines to connected talents */}
      {dependencyLinks?.map((targetPos, index) => (
        <div 
          key={`${id}-dep-${index}`}
          className={styles.talentDependency}
          style={{
            left: `${position[0] * 100 + 25}px`,
            bottom: `${position[1] * 100 + 25}px`,
            width: `${Math.sqrt(
              Math.pow((targetPos[0] - position[0]) * 100, 2) + 
              Math.pow((targetPos[1] - position[1]) * 100, 2)
            )}px`,
            transform: `rotate(${Math.atan2(
              (targetPos[1] - position[1]) * 100,
              (targetPos[0] - position[0]) * 100
            )}rad)`,
            transformOrigin: 'left center'
          }}
        />
      ))}
      
      {/* Talent node */}
      <div 
        id={id}
        className={talentClasses}
        style={talentStyle}
        onClick={!isActive && !isLocked ? onClick : undefined}
        onMouseEnter={(e) => onShowTooltip(id, e)}
        onMouseLeave={onHideTooltip}
        tabIndex={!isActive && !isLocked ? 0 : -1} // Для доступности с клавиатуры
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !isActive && !isLocked) {
            onClick();
          }
        }}
        aria-label={`Талант ${name}, категория ${category}${isActive ? ', активен' : isLocked ? ', недоступен' : ', доступен для изучения'}`}
      >
        <div className={styles.iconContainer}>
          <div className={styles.icon}>{icon}</div>
          <div className={styles.talentName}>{name}</div>
        </div>
      </div>
    </>
  );
};

// ResourceBar component to show progress for each resource type
const ResourceBar: React.FC<{ 
  category: string;
  currentResources: number;
}> = ({ category, currentResources }) => {
  const fillValue =  currentResources / 20;
  
  return (
    <div className={`${styles.resourceBar} ${styles[category]}`}>
      <div 
        className={styles.resourceFill}
        style={{ height: `${fillValue}px` }}
      />
      <div className={styles.resourceLabel}>
        {Math.round(currentResources)}
      </div>
    </div>
  );
};

// Main TalentTree component
const TalentTree: React.FC = () => {
  const dispatch = useAppDispatch();
  const spheres = useAppSelector(selectSpheres);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  // Получаем таланты, предрасчитанные в gameLoop
  const talents = useAppSelector(selectTalents);

  // Состояние для тултипа
  const [tooltip, setTooltip] = useState<TooltipData>({ 
    isVisible: false, 
    talentId: '',
    position: { x: 0, y: 0 },
    boundaryAdjustment: 'center'
  });

  useEffect(() => {
    if (containerRef.current) {
      // Мгновенная прокрутка вниз при загрузке
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);
  
  // Handle talent activation
  const activateTalent = (talentId: string) => {
    // Dispatch action to Redux
    dispatch({
      type: 'game/activateTalent',
      payload: talentId
    } as ActivateTalentAction);
  };

  // Обработчик для корректировки положения тултипа
  const adjustTooltipPosition = (
    x: number, 
    y: number, 
    talentId: string
  ): { position: { x: number; y: number }, boundaryAdjustment: 'left' | 'right' | 'center' } => {
    // Предполагаемая ширина тултипа
    const tooltipWidth = 280;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const padding = 20; // отступ от краев экрана
    
    // Вычисляем позицию по X
    let adjustedX = x;
    let adjustedY = y;
    let boundaryAdjustment: 'left' | 'right' | 'center' = 'center';
    
    // Проверка на выход за левую границу
    if (x - tooltipWidth / 2 < padding) {
      adjustedX = padding + tooltipWidth / 2;
      boundaryAdjustment = 'left';
    }
    // Проверка на выход за правую границу
    else if (x + tooltipWidth / 2 > windowWidth - padding) {
      adjustedX = windowWidth - padding - tooltipWidth / 2;
      boundaryAdjustment = 'right';
    }
    
    // Приблизительная высота тултипа (можно уточнить после рендеринга)
    const estimatedTooltipHeight = 200;
    
    // Проверка на выход за нижнюю границу экрана
    if (y + estimatedTooltipHeight > windowHeight - padding) {
      // Размещаем тултип над элементом
      const talent = document.getElementById(talentId);
      if (talent) {
        const rect = talent.getBoundingClientRect();
        adjustedY = rect.top - 10;
      } else {
        adjustedY = windowHeight - padding - estimatedTooltipHeight;
      }
    }
    
    return { 
      position: { x: adjustedX, y: adjustedY },
      boundaryAdjustment
    };
  };

  // Обработчики для тултипа
  const handleShowTooltip = (talentId: string, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const originalX = rect.left + rect.width / 2;
    const originalY = rect.bottom + 5;
    
    // Применяем корректировку
    const adjustedPosition = adjustTooltipPosition(originalX, originalY, talentId);
    
    setTooltip({
      isVisible: true,
      talentId,
      ...adjustedPosition
    });
  };

  const handleHideTooltip = () => {
    setTooltip(prev => ({ ...prev, isVisible: false }));
  };

  // Находим данные таланта для тултипа
  const tooltipTalent = useMemo(() => {
    if (!tooltip.isVisible) return null;
    const talent = TALENTS.find(t => t.id === tooltip.talentId);
    return talent as TalentType | null;
  }, [tooltip.isVisible, tooltip.talentId]);

  const viewTalents = useMemo(()=>{
    return TALENTS.map(talent => {
      const foundTalent = talents.find(t => t.id === talent.id);
      return {
        ...talent,
        ...foundTalent
      };
    });
  },[talents]);
  
  return (
    <div 
      ref={containerRef} 
      className={styles.talentTreeContainer}
      role="region" 
      aria-label="Дерево талантов"
    >
      {/* Resource bars for each sphere */}
      <div className={styles.resourceBars}>
        {Object.entries(spheres).map(([key, sphere]) => (
          <ResourceBar
            key={key}
            category={key}
            currentResources={sphere.resources}
          />
        ))}
      </div>
      
      {/* Talent tree */}
      <div className={styles.talentTree}>
        {viewTalents.map(talent => (
          <Talent
            key={talent.id}
            id={talent.id}
            name={talent.name || ''}
            description={talent.description || ''}
            category={talent.category}
            icon={talent.icon}
            position={talent.position}
            isVisible={talent.isVisible || false}
            isActive={talent.state === 'active'}
            isLocked={!talent.isAvailable}
            dependencyLinks={talent.meta?.dependencyLinks}
            onClick={() => activateTalent(talent.id)}
            onShowTooltip={handleShowTooltip}
            onHideTooltip={handleHideTooltip}
          />
        ))}
      </div>

      {/* Tooltip using separated component */}
      {tooltip.isVisible && tooltipTalent && (
        <TalentTooltip 
          talent={tooltipTalent}
          position={tooltip.position}
          boundaryAdjustment={tooltip.boundaryAdjustment}
          tooltipRef={tooltipRef}
        />
      )}
    </div>
  );
};

export default TalentTree; 