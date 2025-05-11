import React, { useMemo } from 'react';
import { useAppSelector } from '../app/hooks';
import { selectActiveProblems } from '../app/gameSlice';
import { GameProblem } from './GameProblem';
import { ActiveProblem, Problem } from '../types';
import { Problems as PROBLEMS } from '../Problems';

export const GameProblems: React.FC = () => {
  const activeProblems = useAppSelector(selectActiveProblems);
  
  const problems = useMemo(() => {
    if (activeProblems.length === 0) {
      return [];
    }
    
    return activeProblems
      .map(problemObj => {
        const problemData = PROBLEMS[problemObj.id];
        if (!problemData) return null;
        
        // Создаем объект проблемы с информацией о проекте и времени
        return {
          problem: problemData,
          projectId: problemObj.projectId,
          startTime: problemObj.startTime,
          position: problemObj.position
        };
      })
      .filter((problem): problem is { problem: Problem; projectId: string; startTime: number; position: number[] } => 
        problem !== null
      );
  }, [activeProblems]);
  
  return (
    <div className="game-problems-container">
      {problems.map(problem => (
        <GameProblem 
          key={`${problem.problem.id}-${problem.projectId}-${problem.startTime}`} 
          problem={problem.problem} 
          projectId={problem.projectId}
          startTime={problem.startTime}
          position={problem.position}
        />
      ))}
    </div>
  );
}; 