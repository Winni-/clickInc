import React, { FC, ReactNode } from 'react';
import CutscenePlayer from '../CutscenePlayer';
import IntroCutscene from './IntroCutscene';
import StageTransitionCutscene from './StageTransitionCutscene';
import FinalCutscene from './FinalCutscene';

export interface CutscenesManagerProps {
  type: 'intro' | 'transition' | 'final';
  isVisible: boolean;
  onSkip: () => void;
  targetStage?: number;
}

export const CutscenesManager: FC<CutscenesManagerProps> = ({ 
  type, 
  isVisible,
  onSkip,
  targetStage = 1
}) => {
  const getCutsceneContent = (): ReactNode => {
    switch (type) {
      case 'intro':
        return <IntroCutscene />;
      case 'transition':
        return <StageTransitionCutscene targetStage={targetStage} />;
      case 'final':
        return <FinalCutscene />;
      default:
        return null;
    }
  };

  // Обработчик завершения катсцены
  const handleCutsceneComplete = () => {
    onSkip(); // Вызываем тот же обработчик, что и при пропуске
  };

  return (
    <CutscenePlayer 
      content={getCutsceneContent()}
      onSkip={onSkip}
      isVisible={isVisible}
      onComplete={handleCutsceneComplete}
    />
  );
};

// Экспортируем все компоненты
export { default as IntroCutscene } from './IntroCutscene';
export { default as StageTransitionCutscene } from './StageTransitionCutscene';
export { default as FinalCutscene } from './FinalCutscene'; 