import React, { useMemo, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectActiveProjects, failProject, setGameOver, completeProject } from '../../app/gameSlice';
import ProjectItem from './ProjectItem';
import styles from './index.module.scss';
import { Projects as PROJECTS } from '../../Projects';
import { StateProject } from '../../types';

/**
 * Компонент списка проектов
 */
const Projects: React.FC = () => {
  const stateProjects = useAppSelector(selectActiveProjects);
  const [completedProjects, setCompletedProjects] = useState<StateProject[]>([]);
  
  // Объединяем активные и завершенные проекты
  const projects = useMemo(() => {
    const allProjects = [...completedProjects];
    stateProjects.forEach(project => {
      if (!allProjects.some(p => p.id === project.id)) {
        allProjects.push(project);
      }
    });
    return allProjects.map(project => ({...PROJECTS[project.id], ...project}));
  }, [stateProjects, completedProjects]);


  // Следим за проектами со статусом 'success' или 'failure', чтобы добавить их в завершенные
  useEffect(() => {
    const successProjects = stateProjects.filter(p => p.status === 'success' || p.status === 'failure');
    if (successProjects.length > 0) {
      // Добавляем время завершения и помечаем как видимые
      const projectsWithTimes = successProjects.map(p => ({
        ...p,
        completedAt: Date.now(),
        isVisible: true
      }));
      
      // Удаляем старые завершенные проекты, которые уже есть в completedProjects, и добавляем новые
      setCompletedProjects(prev => {
        const updatedProjects = prev.filter(p => !successProjects.some(sp => sp.id === p.id));
        return [...updatedProjects, ...projectsWithTimes];
      });
    }
    
  }, []);


  return (
    <div className={styles.projectsContainer}>
      <div className={styles.projectsList}>
        {projects.map((project) => (
          <ProjectItem
            key={project.id}
            id={project.id}
            name={project.name}
            description={project.description}
            icon={project.icon}
            progress={project.progress}
            status={project.status}
            effects={project.effects}
            failEffects={project.failEffects}
          />
        ))}
      </div>
    </div>
  );
};

export default Projects;
