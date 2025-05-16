import React from 'react';
import styles from './index.module.scss';

interface StartScreenProps {
  onResume: () => void;
  onNewGame: () => void;
  hasSave: boolean;
}

const StartScreen: React.FC<StartScreenProps> = ({ onResume, onNewGame, hasSave }) => {
  return (
    <div className={styles.startScreen}>
      <h1>ClickInc.</h1>
      <div className={styles.startButtons}>
        <button disabled={!hasSave} onClick={onResume}>Продолжить</button>
        <button onClick={onNewGame}>Новая игра</button>
      </div>
    </div>
  );
};

export default StartScreen; 