import React, {useEffect, useState} from 'react';
import { Feature } from 'geojson';
import './App.css';
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { selectedCountry, selectGame, resetGame, updateGameState, addToNewsQueue } from "./app/gameSlice";
import { Step0 } from "./parts/step0";
import { Step1 } from "./parts/step1";
import { GameEvents } from "./components/GameEvents";
import { GameProblems } from "./components/GameProblems";
import { NewsDisplay } from "./components/NewsDisplay";
import { CutscenesManager } from "./components/Cutscenes";
import StartScreen from './parts/StartScreen';
import { DevTools } from './parts/DevTools';
import styles from './App.module.scss';

export type GeoPosition = { x: number; y: number };
function App() {
  const country = useAppSelector(selectedCountry);
  const game = useAppSelector(selectGame);
  const dispatch = useAppDispatch();
  const [selectedGeography, setSelectedGeography] = useState<Feature | null>(null);
  const [clickPosition, setClickPosition] = useState<GeoPosition | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isStep0Visible, setIsStep0Visible] = useState(false);
  const [isStep1Visible, setIsStep1Visible] = useState(false);
  const [isStartScreenVisible, setIsStartScreenVisible] = useState(true);
  const [prevStage, setPrevStage] = useState(0);
  
  // Состояние для управления роликами
  const [cutsceneState, setCutsceneState] = useState({
    isVisible: false,
    type: 'intro' as 'intro' | 'transition' | 'final',
    targetStage: 1
  });
  
  useEffect(() => {
    // действия после выбора страны
    if (game.selectedCountry) {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setIsTransitioning(false);
        setIsStep0Visible(false);
      }, 1000);
      setTimeout(() => {
        setIsStep1Visible(true);
      }, 1);
    }
  }, [game.selectedCountry]);

  // Отслеживаем изменение этапа игры и добавляем соответствующую новость
  useEffect(() => {
    if (game.stage !== prevStage) {
      setPrevStage(game.stage);
      
      // Добавляем новость в зависимости от этапа
      if (game.stage === 1) {
        dispatch(addToNewsQueue('initial-news'));
      } else if (game.stage === 2) {
        dispatch(addToNewsQueue('space-exploration'));
        
        // Показываем ролик перехода на второй этап
        setCutsceneState({
          isVisible: true,
          type: 'transition',
          targetStage: 2
        });
      }
    }
  }, [game.stage, prevStage, dispatch]);

  // Функция для начала новой игры
  const startNewGame = () => {
    // Сбросить состояние игры к начальному
    dispatch(resetGame());
    
    // Показываем вступительный ролик
    setCutsceneState({
      isVisible: true,
      type: 'intro',
      targetStage: 1
    });
  };

  // Функция для возобновления игры
  const resumeGame = () => {
    setIsStartScreenVisible(false);
    if (game.selectedCountry) {
      setIsStep1Visible(true);
    } else {
      setIsStep0Visible(true);
    }
  };
  
  // Обработчик завершения просмотра ролика
  const handleCutsceneSkip = () => {
    setCutsceneState({
      ...cutsceneState,
      isVisible: false
    });
    
    // После закрытия ролика показываем соответствующий экран
    setIsStartScreenVisible(false);
    
    if (cutsceneState.type === 'intro') {
      setIsStep0Visible(true);
    } else if (cutsceneState.type === 'transition' && game.selectedCountry) {
      setIsStep1Visible(true);
    }
  };

  return (
    <div className={`App ${styles.app}`}>
      {isStartScreenVisible && (
        <StartScreen 
          onResume={resumeGame}
          onNewGame={startNewGame}
          hasSave={false}
        />
      )}
      {process.env.NODE_ENV === 'development' &&
        <DevTools />
      }
      
      {game.gameOver && (
        <div className={styles.gameOverScreen}>
          <h1>Поражение</h1>
          <p>{game.gameOverReason || 'Игра окончена!'}</p>
          <div className={styles.gameOverButtons}>
            <button onClick={startNewGame}>Новая игра</button>
          </div>
        </div>
      )}
      
      {/* Компонент для отображения роликов */}
      <CutscenesManager
        type={cutsceneState.type}
        isVisible={cutsceneState.isVisible}
        onSkip={handleCutsceneSkip}
        targetStage={cutsceneState.targetStage}
      />
      
      <div className="viewport" style={{ display: isStartScreenVisible || game.gameOver || cutsceneState.isVisible ? 'none' : 'block' }}>
        <div className="interface">
          <div className="top"></div>
          <div className="bottom"></div>
        </div>
        {!!isStep0Visible && (
          <Step0 isSelected={isTransitioning} />
        )}
        {!!country && (
          <Step1
            geo={selectedGeography}
            clickPosition={clickPosition}
            isVisible={isStep1Visible}
          />
        )}
        
        {/* Компонент для отображения игровых событий */}
        <GameEvents />
        
        {/* Компонент для отображения игровых проблем */}
        <GameProblems />
        
        {/* Компонент для отображения новостей */}
        <NewsDisplay />
      </div>
    </div>
  );
}

export default App;
