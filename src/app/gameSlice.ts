import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from "./store";
import {MANUAL, COMMON, FAITH, SCIENCE, ECONOMY} from "./constants";
import { GAME_EVENTS } from '../Events';
import { TALENTS } from '../Talents';
import { Projects as BaseProjects } from "../Projects";
import { GameState, Talent } from '../types';
import { applyTalentEffect } from './utils';
import { Problems as PROBLEMS } from '../Problems';
import { Projects as PROJECTS } from '../Projects';
import { UPGRADES } from '../Upgrades';
import { News } from '../News';

const initialState: GameState = {
  CPS: 0,
  upgrades: UPGRADES.map(upgrade => ({
    id: upgrade.id,
    isVisible: typeof upgrade.visible === 'boolean' ? upgrade.visible : false,
    level: 0,
    cost: upgrade.cost,
    CPS: upgrade.CPS,
    available: upgrade.available
  })),
  selectedCountry: undefined,
  countries: {},
  conqueredCountries: [], // Initially empty - player only has their selected country
  resources: 0,
  manualClickPower: 1,
  autoClickPower: 0,
  spheres: {
    [ECONOMY]: {
      name: ECONOMY,
      icon: "💸",
      CPS: 0,
      resources: 0,
      count: 0,
      baseCPS: 0.1,
    },    
    [SCIENCE]: {
      name: SCIENCE,
      icon: "🧬",
      CPS: 0,
      resources: 0,
      count: 0,
      baseCPS: 0.5,
    },
    [FAITH]: {
      name: FAITH, 
      icon: "⛪️",
      CPS: 0,
      resources: 0,
      count: 0,
      baseCPS: 2,
    },
  },
  multipliers: {
    [COMMON]: 1.0,
    [ECONOMY]: 1.0,
    [FAITH]: 1.0,
    [SCIENCE]: 1.0
  },
  events: Object.keys(GAME_EVENTS),
  activeEvents: [],  // Теперь это массив объектов {id: string; position: number[]}
  eventHistory: {},
  projects: Object.keys(BaseProjects),
  activeProjects: [],
  problems: [],
  activeProblems: [],
  conquestSpeed: 1.0,
  projectSpeed: 1.0,
  secondStage: [],
  stage: 0,
  gameOver: false,
  lastConquest: {
    lastTriggered: Date.now(),
    country: ''
  },
  mapEvents: [],
  talents: TALENTS.map(talent => ({
    id: talent.id,
    isVisible: false,
    isAvailable: false,
    state: talent.state,
  })),
  seed: Math.random(),
  clickEffects: {
    [ECONOMY]: 0,
    [FAITH]: 0,
    [SCIENCE]: 0,
  },
  total: 0,
  news: Object.keys(News),
  newsQueue: [],
  activeNews: null,
  lastNewsTime: 0,
  cosmicCivilization: {
    FTL: false,
    conquest: false,
    planetShield: false,
    shipShield: false,
  }
};

const DEFAULT_CONFIG = {
  baseCost: 10,
  growthRate: Math.pow(100, 1/9), // ≈1.6681
  transitionLevel: 100,
  linearIncrement: 500
};
function calculateUpgradeCost(level: number, config = DEFAULT_CONFIG) {
  const { baseCost, growthRate, transitionLevel, linearIncrement } = config;

  if (level <= transitionLevel) {
    // Экспоненциальный рост: baseCost * growthRate^(level-1)
    return baseCost * Math.pow(growthRate+0.5, level);
  }

  // Расчет стоимости на уровне перехода
  const costAtTransition = baseCost * Math.pow(growthRate, transitionLevel - 1);

  // Линейный рост после переходного уровня
  return costAtTransition + (level - transitionLevel) * linearIncrement;
}


const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    buyUpgrade: (state, action: PayloadAction<string>) => {
      const upgradeId = action.payload;
      const stateUpgrade = state.upgrades.find(u => u.id === upgradeId);
      const originalUpgrade = UPGRADES.find(u => u.id === upgradeId);
      
      if (stateUpgrade && originalUpgrade && state.resources >= stateUpgrade.cost) {
        //remove price from wallet
        state.resources -= stateUpgrade.cost;

        // Рассчитываем новую стоимость
        const newCost = calculateUpgradeCost(stateUpgrade.level, {
          baseCost: originalUpgrade.cost,
          growthRate: originalUpgrade.growthRate,
          transitionLevel: originalUpgrade.transitionLevel,
          linearIncrement: originalUpgrade.linearIncrement
        });
        
        // Рассчитываем прирост CPS
        const cpsIncrease = stateUpgrade.CPS * Math.pow(originalUpgrade.growthRate, stateUpgrade.level);
        
        // Обновляем апгрейд в состоянии
        stateUpgrade.level += 1;
        stateUpgrade.cost = newCost;
        
        // Обновляем соответствующие показатели
        if (originalUpgrade.spheres.includes(MANUAL)) {
          state.manualClickPower += cpsIncrease;
        }
        if (originalUpgrade.spheres.includes(COMMON)) {
          state.autoClickPower += cpsIncrease;
        }
        
        originalUpgrade.spheres.filter(sphere=>
          (sphere !== MANUAL && sphere !== COMMON)
        ).forEach(sphere => {
          // @ts-ignore
          state.spheres[sphere].CPS += cpsIncrease;
        });
      }
    },
    selectCountry: (state, action: PayloadAction<string>) => {
      if (!state.selectedCountry) {
        state.selectedCountry = action.payload;
        // When selecting a country, it's automatically conquered
        state.conqueredCountries = [action.payload];
        // We will base stage difference on fack of country selection
        state.stage = 1;
      }
    },
    manualClick: (state) => {
      state.resources += state.manualClickPower;
      state.total += state.manualClickPower;
      // some talent effects
      Object.keys(state.clickEffects).forEach(sphere => {
        state.spheres[sphere as keyof typeof state.spheres].resources += state.manualClickPower * state.clickEffects[sphere];
      });
    },
    updateResources: (state, action: PayloadAction<{
      delta: number;
      resources: {[entityType: string]: number;};
    }>) => {
      Object.keys(action.payload.resources).forEach(sphere => {
        if( sphere === COMMON) {
          state.resources += action.payload.resources[COMMON];
          state.total += action.payload.resources[COMMON];
        } else {
          // @ts-ignore
          state.spheres[sphere].resources += action.payload.resources[sphere];
        }
      });
    },
   
    activateTalent: (state, action: PayloadAction<string>) => {
      const talentId = action.payload;
      const talent = TALENTS.find(t => t.id === talentId);
      
      if (talent) {
        applyTalentEffect(talent, state);
        const t = state.talents.find(t => t.id === talentId);
        if(t) {
          t.state = 'active';
          // Добавляем новость о разблокировке таланта
          if( talent.news ) {
            state.newsQueue.push(talent.news);
          }
        }
      }
    },
    // reducer to conquer a country
    conquerCountry: (state, action: PayloadAction<string | string[]>) => {
      const countryIds = Array.isArray(action.payload) ? action.payload : [action.payload];
      // Filter out countries that are already conquered
      const newConquests = countryIds.filter(id => !state.conqueredCountries.includes(id));
      
      if (newConquests.length > 0) {
        // Add newly conquered countries to the list
        state.conqueredCountries = [...state.conqueredCountries, ...newConquests];

        if(state.conqueredCountries.length === 2) {// first conquest
          // Добавляем новость о завоевании страны
          state.newsQueue.push('special-conquest');
        }
      }
      state.mapEvents = state.mapEvents.filter(e => !newConquests.includes(e.targetCountry));
      // Добавляем ресурсы за завоеванные страны
      state.resources += state.conqueredCountries.length * state.multipliers[COMMON] * 10 ;
    },
    // редьюсер для установки поражения игры
    setGameOver: (state, action: PayloadAction<string>) => {
      state.gameOver = true;
      state.gameOverReason = action.payload;
    },
    failProject: (state, action: PayloadAction<string>) => {
      const project = state.activeProjects.find(p => p.id === action.payload);
      if (project) {
        state.activeProjects = state.activeProjects.filter(p => p.id !== action.payload);
        PROJECTS[action.payload]?.failEffects?.forEach(effect => {
          effect(state);
        });
      }
    },
    completeProject: (state, action: PayloadAction<string>) => {
      const project = state.activeProjects.find(p => p.id === action.payload);
      if (project) {
        // Помечаем проект как успешный, но не удаляем из массива сразу
        project.status = 'success';
        // Применяем эффекты проекта
        PROJECTS[action.payload]?.effects?.forEach(effect => {
          effect(state);
        });
      }
    },
    // редьюсер для сброса игры
    resetGame: (state) => {
      return {
        ...initialState,
        stage: 0,
        gameOver: false,
        gameOverReason: undefined,
        activeEvents: [], // Явно указываем пустой массив для нового типа
        activeProblems: [], // Явно указываем пустой массив активных проблем
        news: Object.keys(News), // Восстанавливаем полный список новостей
        newsQueue: [],
        activeNews: null,
        lastNewsTime: 0,
      };
    },
    updateGameState: (state, action: PayloadAction<Partial<GameState>>) => {
      return { ...state, ...action.payload };
    },
    resolveEvent: (state, action: PayloadAction<string>) => {
      const eventObj = state.activeEvents.find(e => e.id === action.payload);
      
      if (eventObj) {
        const eventId = eventObj.id;
        
        // increment event history
        if (state.eventHistory[eventId]) {
          state.eventHistory[eventId].count += 1;
          state.eventHistory[eventId].lastTriggered = Date.now();
        }
        
        // apply effects
        GAME_EVENTS[eventId].effects.forEach(effect => {
          effect(state);
        });
        
        // remove event from active events
        state.activeEvents = state.activeEvents.filter(e => e.id !== eventId);
        
        // remove event from events
        if (GAME_EVENTS[eventId].once) {
          state.events = state.events.filter(e => e !== eventId);
        }
      }
    },
    clickProblem: (state, action: PayloadAction<{problemId: string; projectId: string}>) => {
      const { problemId, projectId } = action.payload;
      const problemIndex = state.activeProblems.findIndex(p => p.id === problemId && p.projectId === projectId);
      
      if (problemIndex !== -1) {
        // Подсчет кликов в компоненте, здесь только удаление, если нужное количество кликов достигнуто
        // Это обрабатывается в GameProblem компоненте
      }
    },
    resolveProblem: (state, action: PayloadAction<{problemId: string; projectId: string}>) => {
      const { problemId, projectId } = action.payload;
      
      // Удаляем проблему из активных
      state.activeProblems = state.activeProblems.filter(
        p => !(p.id === problemId && p.projectId === projectId)
      );

      // Добавляем новость о решении проблемы
      state.newsQueue.push('special-problem-solved');
    },
    failProblem: (state, action: PayloadAction<{problemId: string; projectId: string}>) => {
      const { problemId, projectId } = action.payload;
      
      // Удаляем проблему из активных
      state.activeProblems = state.activeProblems.filter(
        p => !(p.id === problemId && p.projectId === projectId)
      );
      
      // Вызываем failEffects для проекта
      const project = PROJECTS[projectId];
      if (project && project.failEffects) {
        project.failEffects.forEach(effect => effect(state));
      }
      
      // Удаляем проект из активных
      state.activeProjects = state.activeProjects.filter(p => p.id !== projectId);
    },
    showNews: (state, action: PayloadAction<string>) => {
      state.activeNews = action.payload;
      state.lastNewsTime = Date.now();
    },
    hideNews: (state) => {
      state.activeNews = null;
    },
    addToNewsQueue: (state, action: PayloadAction<string>) => {
      // Проверяем, что новость с таким ID существует и не добавлена уже в очередь
      if (state.news.includes(action.payload) && !state.newsQueue.includes(action.payload)) {
        state.newsQueue.push(action.payload);
      }
    },
    setStage: (state, action: PayloadAction<number>) => {
      state.stage = action.payload;
    },
  }
});


export const selectedCountry = (state: RootState) => state.game.selectedCountry;
export const selectStage = (state: RootState) => state.game.stage;
export const selectResources = (state: RootState) => state.game.resources;
export const selectSpheres = (state: RootState) => state.game.spheres;
export const selectUpgrades = (state: RootState) => state.game.upgrades;
export const selectManualClickPower = (state: RootState) => state.game.manualClickPower;
export const selectGame = (state: RootState) => state.game;
export const selectConqueredCountries = (state: RootState) => state.game.conqueredCountries;
export const selectProjects = (state: RootState) => state.game.projects;
export const selectActiveEvents = (state: RootState) => state.game.activeEvents;
export const selectActiveProjects = (state: RootState) => state.game.activeProjects;
export const selectActiveProblems = (state: RootState) => state.game.activeProblems;
export const selectMapEvents = (state: RootState) => state.game.mapEvents;
export const selectTalents = (state: RootState) => state.game.talents;
export const selectActiveNews = (state: RootState) => state.game.activeNews;
export const selectTotal = (state: RootState) => state.game.total;
export const { 
  manualClick, 
  buyUpgrade, 
  selectCountry, 
  updateResources,
  activateTalent,
  conquerCountry,
  setGameOver,
  resetGame,
  updateGameState,
  failProject,
  completeProject,
  resolveEvent,
  clickProblem,
  resolveProblem,
  failProblem,
  showNews,
  hideNews,
  addToNewsQueue,
  setStage
} = gameSlice.actions;

export default gameSlice.reducer;

/**
 * Как вызвать экран поражения в игре:
 * 
 * 1. Из компонента:
 * 
 * ```tsx
 * import { useAppDispatch } from './app/hooks';
 * import { setGameOver } from './app/gameSlice';
 * 
 * const MyComponent = () => {
 *   const dispatch = useAppDispatch();
 *   
 *   const handleFailure = () => {
 *     dispatch(setGameOver('Причина поражения'));
 *   };
 *   
 *   return <button onClick={handleFailure}>Проиграть</button>;
 * };
 * ```
 * 
 * 2. Через провал критического проекта:
 * 
 * - Добавьте флаг `isCritical: true` к проекту
 * - При провале такого проекта экран поражения отобразится автоматически
 * 
 * 3. Через эффекты проекта или таланта:
 * 
 * - Можно добавить диспатч действия `setGameOver` в эффекты
 */

// Добавляем обработчик для добавления новости при завершении проекта
export const calculateTick = (state: GameState) => {
  // Проверка проектов
  state.activeProjects.forEach(project => {
    if (project.progress >= 100 && project.status === 'in_progress') {
      // Проект завершен, но еще не обработан
      project.status = 'success';
      
      // Добавляем новость о завершении проекта
      state.newsQueue.push('special-project-complete');
      
      // Применяем эффекты проекта
      const projectData = PROJECTS[project.id];
      if (projectData && projectData.effects) {
        projectData.effects.forEach(effect => effect(state));
      }
    }
  });
  
  // Мы не удаляем завершенные проекты сразу, это будет происходить в компоненте после таймера
};
