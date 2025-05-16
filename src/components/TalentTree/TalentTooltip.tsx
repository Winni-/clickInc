import React, { RefObject } from 'react';
import styles from './index.module.scss';
import { Talent } from '../../types';
import { TALENTS } from '../../Talents';
import { ECONOMY, SCIENCE, FAITH } from '../../app/constants';
import { getEffectsDescription } from '../../app/utils';

// Получение категории таланта для тултипа
const getCategoryClass = (category: string): string => {
  if (category === ECONOMY) return styles.economy;
  if (category === SCIENCE) return styles.science;
  if (category === FAITH) return styles.faith;
  return '';
};

// Функция-адаптер для совместимости с предыдущим кодом
export const getTalentEffects = (talent: Talent): string[] => {
  if (talent.meta?.effectDesctription) {
    return [talent.meta.effectDesctription];
  }
  return getEffectsDescription(talent.effects);
};

// Получение требований таланта
const getTalentRequirements = (talent: Talent): string[] => {
  if (talent.meta?.requirementsDescription) {
    return [talent.meta.requirementsDescription];
  }
  const requirements: string[] = [];
  
  // Проверяем, есть ли зависимости от других талантов
  if (talent.requires.length > 0) {
    talent.requires.forEach(requirement => {
      if (requirement.talentId) {
        const requiredTalent = TALENTS.find(t => t.id === requirement.talentId);
        if (requiredTalent) {
          requirements.push(`Требуется талант "<span class="talent-name">${requiredTalent.name}</span>"`);
        }
      }
    });
  }
  
  // Проверяем доступность на основе ресурсов
  const availabilityString = talent.available.map(fn => fn.toString()).join(' ');
  
  // Проверка ресурсов экономики
  const economyMatch = availabilityString.match(/ECONOMY.+?>=\s*([\d.]+)/);
  if (economyMatch) {
    const resources = parseFloat(economyMatch[1]);
    requirements.push(`<span class="economy-req">${resources}</span> ресурсов экономики`);
  }
  
  // Проверка ресурсов науки
  const scienceMatch = availabilityString.match(/SCIENCE.+?>=\s*([\d.]+)/);
  if (scienceMatch) {
    const resources = parseFloat(scienceMatch[1]);
    requirements.push(`<span class="science-req">${resources}</span> ресурсов науки`);
  }
  
  // Проверка ресурсов веры
  const faithMatch = availabilityString.match(/FAITH.+?>=\s*([\d.]+)/);
  if (faithMatch) {
    const resources = parseFloat(faithMatch[1]);
    requirements.push(`<span class="faith-req">${resources}</span> ресурсов веры`);
  }
  
  // Проверка общих ресурсов
  const resourcesMatch = availabilityString.match(/resources\s*>=\s*([\d.]+)/);
  if (resourcesMatch) {
    const resources = parseFloat(resourcesMatch[1]);
    requirements.push(`<span class="resource-req">${resources}</span> общих ресурсов`);
  }
  
  return requirements;
};

interface TalentTooltipProps {
  talent: Talent;
  position: { x: number; y: number };
  boundaryAdjustment: 'left' | 'right' | 'center';
  tooltipRef?: RefObject<HTMLDivElement>;
}

const TalentTooltip: React.FC<TalentTooltipProps> = ({ 
  talent, 
  position, 
  boundaryAdjustment,
  tooltipRef 
}) => {
  // Получаем списки эффектов и требований
  const effects = getTalentEffects(talent);
  const requirements = getTalentRequirements(talent);

  return (
    <div 
      ref={tooltipRef}
      className={`${styles.talentTooltip} ${styles[`tooltip-${boundaryAdjustment}`]}`}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px` 
      }}
    >
      <div className={styles.tooltipHeaderWow}>
        <div className={`${styles.tooltipIcon} ${getCategoryClass(talent.category)}`}>
          {talent.icon}
        </div>
        <div className={styles.tooltipTitleContainer}>
          <div className={styles.tooltipName}>{talent.name}</div>
          <div className={`${styles.tooltipCategory} ${getCategoryClass(talent.category)}`}>
            {talent.category}
          </div>
        </div>
      </div>
      
      <div className={styles.tooltipDescription}>
        {talent.description || 'Нет описания'}
      </div>
      
      {effects.length > 0 && (
        <div className={styles.tooltipEffects}>
          <div className={styles.tooltipSectionTitle}>Эффекты:</div>
          <ul className={styles.effectsList}>
            {effects.map((effect, index) => (
              <li key={index} className={styles.effectItem} dangerouslySetInnerHTML={{ __html: effect }} />
            ))}
          </ul>
        </div>
      )}
      
      {/* Отображаем статус таланта */}
      <div className={styles.tooltipStatus}>
        {talent.state === 'active' ? (
          <span className={styles.activeStatus}>Активен</span>
        ) : talent.isAvailable ? (
          <span className={styles.availableStatus}>Доступен для изучения</span>
        ) : (
          <div className={styles.tooltipRequirements}>
            <div className={styles.tooltipSectionTitle}>Требования:</div>
            {requirements.length > 0 ? (
              <ul className={styles.requirementsList}>
                {requirements.map((req, index) => (
                  <li key={index} className={styles.lockedStatus} dangerouslySetInnerHTML={{ __html: req }} />
                ))}
              </ul>
            ) : (
              <span className={styles.lockedStatus}>
                Не выполнены необходимые условия
              </span>
            )}
          </div>
        )}
      </div>
      {talent.meta?.flavorText && (
        <div className={styles.tooltipFlavorText}>
          {talent.meta.flavorText}
        </div>
      )}
    </div>
  );
};

export default TalentTooltip; 