import React, { useMemo, useState } from 'react';
import styles from './index.module.scss';
import { useAppSelector } from '../../app/hooks';
import { selectResources, selectSpheres, selectManualClickPower, selectedCountry, selectStage } from '../../app/gameSlice';
import CountUp from '../CountUp';

interface TooltipData {
  isVisible: boolean;
  type: 'sphere' | 'main' | 'country' | 'earth';
  sphere?: string;
  position: { x: number; y: number };
}

const tooltipInfo: Record<string, string> = {
  'economy': 'Экономика: получайте ресурсы, улучшая рынки, банки. Победа при достижении 100мм',
  'science': 'Наука: развивайте технологии, строя спутники и лаборатории. Победа при достижении 100мм',
  'faith': 'Вера: расширяйте свое влияние через храмы и крестоносцев. Победа при достижении 100мм',
  'main': '', // будет заполнено динамически
  'country': 'Выбранная страна, которой вы сейчас управляете. Объедените Землю, для противостояния инопланетной угрозе.',
  'earth': 'Теперь вы управляете Землей, судьба человечества лежит на ваших плечах.'
};

const ResourcesHeader: React.FC = () => {
  const resources = useAppSelector(selectResources);
  const spheres = useAppSelector(selectSpheres);
  const clickPower = useAppSelector(selectManualClickPower);
  const countryName = useAppSelector(selectedCountry);
  const stage = useAppSelector(selectStage);
  const [tooltip, setTooltip] = useState<TooltipData>({ 
    isVisible: false,
    type: 'sphere',
    position: { x: 0, y: 0 } 
  });

  const handleMouseEnter = (type: 'sphere' | 'main' | 'country' | 'earth', sphere?: string, e?: React.MouseEvent) => {
    if (!e) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      isVisible: true,
      type,
      sphere,
      position: { 
        x: rect.left, 
        y: rect.bottom + 5 
      }
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, isVisible: false });
  };

  // Динамическое содержимое тултипа
  const getTooltipContent = () => {
    switch (tooltip.type) {
      case 'sphere':
        if (tooltip.sphere) {
          return tooltipInfo[tooltip.sphere] || `${tooltip.sphere}: Развивайте эту сферу через специальные улучшения.`;
        }
        break;
      case 'main':
        return `Кликай на страну: +${Math.round(clickPower)}₿ за клик.`;
      case 'country':
        return tooltipInfo.country;
      case 'earth':
        return tooltipInfo.earth;
      default:
        break;
    }
    return '';
  };
  const getRandomEarth = useMemo(() => {
    const names = ['𒆠', 'Erṣetu', 'Terra', 'Miðgarðr', 'Tlālticpac', '🌍']
    return Math.random() <= 0.05 ? names[Math.floor(Math.random() * names.length)] : 'Earth';
  }, []);

  return (
    <div className={styles.resourcesHeader}>
      <div className={styles.spheresContainer}>
        {Object.entries(spheres).map(([key, sphere]) => (
          <div 
            key={key} 
            className={styles.sphereResource}
            onMouseEnter={(e) => handleMouseEnter('sphere', key, e)}
            onMouseLeave={handleMouseLeave}
          >
            <div className={styles.sphereIcon}>{sphere.icon}</div>
            <div className={styles.sphereValue}>
              <CountUp 
                value={sphere.resources} 
                duration={750} 
                showColors
                className={styles.counter}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div 
        className={styles.countryInfo}
        onMouseEnter={(e) => handleMouseEnter(stage === 2 ? 'earth' : 'country', undefined, e)}
        onMouseLeave={handleMouseLeave}
      >
        {stage === 2 ? getRandomEarth : countryName || 'Выберите страну'}
      </div>
      
      <div 
        className={styles.mainResources}
        onMouseEnter={(e) => handleMouseEnter('main', undefined, e)}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.icon}>💰</div>
        <CountUp value={resources} suffix="₿" duration={950} showColors className={styles.value} />
      </div>
      
      {tooltip.isVisible && (
        <div 
          className={styles.tooltip} 
          style={{ 
            left: `${tooltip.position.x}px`, 
            top: `${tooltip.position.y}px` 
          }}
        >
          {getTooltipContent()}
        </div>
      )}
    </div>
  );
};

export default ResourcesHeader; 