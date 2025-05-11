import { Middleware, MiddlewareAPI, Dispatch, AnyAction } from 'redux';
import { RootState } from './store';

// Создаем единый экземпляр воркера для всего приложения
export const gameWorker = new Worker(new URL('./gameLoop.ts', import.meta.url));

// Локальное состояние для middleware
let isStartScreenVisible = true;

// Middleware для работы с воркером
export const workerMiddleware: Middleware = 
  (store: MiddlewareAPI<Dispatch<AnyAction>, RootState>) => {
  
  // Подписываемся на сообщения от воркера
  gameWorker.onmessage = (e) => {
    const gameState = e.data;
    // Обновляем состояние игры при получении данных от воркера
    store.dispatch({ type: 'game/updateGameState', payload: gameState });
  };
  
  // Запускаем игровой цикл - отправляем текущее состояние в воркер каждую секунду
  setInterval(() => {
    const state = store.getState();
    
    // Если игра не окончена и не находимся на стартовом экране
    if (!state.game.gameOver && !isStartScreenVisible) {
      gameWorker.postMessage({
        type: 'TICK',
        state: state.game,
        deltaTime: 1000, // 1 секунда
        windowSize: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      });
    }
  }, 1000);
  
  return next => action => {
    // Отслеживаем изменения стартового экрана
    if (action.type === 'game/resetGame') {
      isStartScreenVisible = false;
    }
    
    // Если состояние игры изменилось, отправляем его в воркер
    if (action.type.startsWith('game/') && action.type !== 'game/updateGameState') {
      // Даем выполниться действию в редьюсере
      const result = next(action);
      
      // Получаем обновленное состояние
      const state = store.getState();
      
      // Отправляем в воркер уведомление об изменении состояния
      gameWorker.postMessage({
        type: 'STATE_UPDATED',
        state: state.game
      });
      
      return result;
    }
    
    // Для остальных действий просто передаем дальше
    return next(action);
  };
}; 