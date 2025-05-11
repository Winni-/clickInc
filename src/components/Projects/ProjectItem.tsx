import React, { useEffect, useState, useRef } from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';
import { Project, Talent } from '../../types';
import { Projects } from '../../Projects';
import { getEffectsDescription } from '../../app/utils';

interface ProjectItemProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  status?: Project['status'];
  effects?: any[];
  failEffects?: any[];
}

const ProjectItem: React.FC<ProjectItemProps> = ({
  id,
  name,
  description,
  icon,
  progress,
  status = 'in_progress',
  effects = [],
  failEffects = []
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [hovered, setHovered] = useState(false);
  const projectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === 'success' || status === 'failure') {
      const newTimer = setTimeout(() => {
        if (!hovered) {
          setIsVisible(false);
        }
      }, 10000);
      setTimer(newTimer);
      
      return () => {
        if (newTimer) clearTimeout(newTimer);
      };
    }
  }, [status, hovered]);

  useEffect(() => {
    if (!hovered && (status === 'success' || status === 'failure') && !timer) {
      const newTimer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);
      setTimer(newTimer);
      
      return () => {
        if (newTimer) clearTimeout(newTimer);
      };
    }
  }, [hovered, status, timer]);

  const handleMouseEnter = () => {
    setHovered(true);
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if ((status === 'success' || status === 'failure') && !timer) {
      const newTimer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);
      setTimer(newTimer);
    }
  };

  if (!isVisible) {
    return null;
  }

  const progressPercent = Math.min(Math.max(progress, 0), 100);
  
  const getEffectsText = () => {
    if (status === 'success' && effects.length > 0) {
      return getEffectsDescription(effects);
    } else if (status === 'failure' && failEffects.length > 0) {
      return getEffectsDescription(failEffects);
    }
    return [];
  };

  const statusClass = status === 'success' ? styles.success : status === 'failure' ? styles.failed : '';
  
  return (
    <div 
      ref={projectRef}
      className={classNames(styles.project, statusClass)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.content}>        
        <div className={styles.progressContainer}>
          <div className={styles.header}>
            <h4 className={styles.title}>{name}</h4>
            <span className={styles.progressText}>{Math.round(progressPercent)}%</span>
            <div className={styles.icon}>{icon}</div>
          </div>
          <div className={styles.description}>{description}</div>
          <div 
            className={styles.progressBar} 
            style={{ width: `${progressPercent}%` }}
          ></div>
          
          {(status === 'success' || status === 'failure') && (
            <div className={styles.statusOverlay}>
              <div className={styles.statusText}>
                {status === 'success' ? 'УСПЕХ!' : 'ПРОВАЛ!'}
              </div>
              <div className={styles.effectText} dangerouslySetInnerHTML={{ __html: getEffectsText().join('') }} />
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default ProjectItem; 