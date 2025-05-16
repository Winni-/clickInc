import { COMMON, FAITH, SCIENCE, ECONOMY, EVENT_AUTO_CLOSE_TIME, TOTAL_RESOURCES_FOR_FIRST_STAGE, SCIENCE_RESOURCES_FOR_FIRST_STAGE, FAITH_RESOURCES_FOR_FIRST_STAGE, ECONOMY_RESOURCES_FOR_FIRST_STAGE } from "./constants";
import { COUNTRY_NAMES } from "../constants";
import { conquestHistory, GameEvent, GameState, MapEvent, StateTalent, StateUpgrade, ActiveProblem, stateProblem } from "../types";
import { GAME_EVENTS, DynamicEvents } from "../Events";
import { Projects as PROJECTS } from "../Projects";
import { Problems as PROBLEMS } from "../Problems";
import { News as NEWS } from "../News";
import { NEWS_INTERVAL } from "../News";
import { TALENTS } from "../Talents";
import { UPGRADES } from "../Upgrades";


// Генерирует случайную позицию на экране
function getRandomPosition(windowSize: { width: number, height: number }): [number, number] {
  // Ограничиваем область появления событий, чтобы они не появлялись слишком близко к краям
  const margin = 50;
  const x = margin + Math.random() * (windowSize.width - margin * 2);
  const y = margin + Math.random() * (windowSize.height - margin * 2);
  return [x, y];
}

// Проверяет, может ли событие быть активировано
function canTriggerEvent(event: string, state: GameState): boolean {
  // Проверяем, не активировано ли уже это событие
  const isAlreadyActive = state.activeEvents.some(e => e.id === event);
  if (isAlreadyActive) return false;
  const eventData = GAME_EVENTS[event];
  const eventHistory = state.eventHistory[event];

  // Проверяем историю события
  if (eventData.once && eventHistory?.count > 0) return false;
  // Если событие имеет кулдаун и не прошло достаточно времени
  if (eventHistory && eventData.cooldown && (Date.now() - (eventHistory.lastTriggered || 0)) < eventData.cooldown) {
    return false;
  }
  // Проверяем все условия события
  return eventData.conditions.every(condition => condition(state));
}

// Выбирает событие для активации
function selectEvent(state: GameState): GameEvent | null {
  const candidateEvents: GameEvent[] = [];
  
  // Перебираем все события
  for (const event of state.events) {
    if (canTriggerEvent(event, state)) {
      candidateEvents.push(GAME_EVENTS[event]);
    }
  }
  
  // Теперь у нас есть список конкретных событий, которые могут быть активированы
  if (candidateEvents.length === 0) return null;
  
  // Выбираем событие с наибольшим весом
  const maxWeight = Math.max(...candidateEvents.map(event => event.weight));
  const maxWeightEvents = candidateEvents.filter(event => event.weight === maxWeight);
  
  // Если нашли события с максимальным весом, выбираем случайное из них
  if (maxWeightEvents.length > 0) {
    const randomIndex = Math.floor(Math.random() * maxWeightEvents.length);
    const selectedEvent = maxWeightEvents[randomIndex];
    
    // Проверяем удачу - вероятность активации события равна его весу (в процентах)
    if (Math.random() * 100 < selectedEvent.weight) {
      return selectedEvent;
    }
  }
  
  // Если не удалось выбрать событие или не повезло, возвращаем null
  return null;
}

// Предрасчет условий видимости и доступности для талантов
function recalculateTalents(state: GameState): StateTalent[] {
  // Получаем список активных талантов
  const activeTalentIds = state.talents.filter(t => t.state === 'active').map(t => t.id);
  
  // Обрабатываем таланты и добавляем вычисленную информацию
  return TALENTS.map(talent => {
    const stateTalent = state.talents.find(t => t.id === talent.id);
    // Проверяем условие видимости
    const isVisible = talent.visible.every(condition => condition(state));
    
    // Проверяем требования для разблокировки таланта
    const requirementsMet = talent.requires.every(req => 
      !req.talentId || activeTalentIds.includes(req.talentId)
    );
    
    // Проверяем условия доступности
    const isAvailable = requirementsMet && talent.available.every(condition => condition(state));
    // Возвращаем обновленный талант со всеми вычисленными свойствами
    return {
      id: talent.id,
      isVisible,
      isAvailable,
      state: stateTalent!.state
    };
  });
}

// Предрасчет видимости апгрейдов
function recalculateUpgrades(state: GameState): StateUpgrade[] {
  return UPGRADES.map(upgrade => {
    // Получаем текущий уровень и стоимость из состояния
    const stateUpgrade = state.upgrades.find(u => u.id === upgrade.id);
    const level = stateUpgrade ? stateUpgrade.level : 0;
    const cost = stateUpgrade ? stateUpgrade.cost : upgrade.cost;
    const CPS = stateUpgrade ? stateUpgrade.CPS : upgrade.CPS;
    const available = stateUpgrade ? stateUpgrade.available : upgrade.available;

    // Проверяем условие видимости
    let isVisible: boolean;
    if (typeof upgrade.visible === 'boolean') {
      isVisible = upgrade.visible;
    } else {
      // Если visible - это функция, вызываем её с текущим состоянием
      isVisible = upgrade.visible(state);
    }
    
    return {
      id: upgrade.id,
      isVisible: state.upgrades.find(u => u.id === upgrade.id)?.isVisible || isVisible,
      level,
      cost,
      CPS,
      available,
    };
  });
}

// Проверяет события и создает новое активное событие, если возможно
function checkEvents(state: GameState, windowSize: { width: number, height: number }): {id: string; position: number[]}[] {
  // Выбираем событие для активации
  const eventToTrigger = selectEvent(state);
  
  // Создаем копию текущих активных событий
  const updatedActiveEvents = [...state.activeEvents];
  
  // Если есть новое событие для добавления
  if (eventToTrigger) {
    state.eventHistory[eventToTrigger.id] = {
      id: eventToTrigger.id,
      lastTriggered: Date.now(),
      count: (state.eventHistory[eventToTrigger.id]?.count || 0) + 1
    };
    
    // Определяем позицию для нового события
    let position: number[];
    if (eventToTrigger.position === "random") {
      position = getRandomPosition(windowSize);
    } else if (Array.isArray(eventToTrigger.position)) {
      position = eventToTrigger.position;
    } else {
      position = getRandomPosition(windowSize);
    }
    
    updatedActiveEvents.push({
      id: eventToTrigger.id,
      position
    });
  }
  
  return updatedActiveEvents;
}

const checkConquest = (state: GameState): [conquestHistory,MapEvent[]] => {
  const randomCountry = COUNTRY_NAMES.filter(country => !state.conqueredCountries.includes(country))[Math.floor(Math.random() * COUNTRY_NAMES.filter(country => !state.conqueredCountries.includes(country)).length)];
  const conquestEvent = DynamicEvents.BUY_COUNTRY(state, randomCountry);
  if (!conquestEvent) return [state.lastConquest,state.mapEvents];
  console.log(conquestEvent.weight * (state.conquestSpeed + (state.total / 100000)));
  // return previous conquest
  if ( conquestEvent.weight * (state.conquestSpeed + (state.total / 100000)) < Math.random() * 100) return [state.lastConquest,state.mapEvents];
  console.log('conquest event triggered');
  
  // @ts-ignore
  if (state.lastConquest.lastTriggered && Date.now() - state.lastConquest.lastTriggered < (conquestEvent?.cooldown / (state.conquestSpeed * state.total) )) return [state.lastConquest,state.mapEvents];

  return [{
    ...state.lastConquest,
    lastTriggered: Date.now(),
    country: randomCountry
  },[...state.mapEvents, {
    id: conquestEvent.id,
    targetCountry: randomCountry,
    description: conquestEvent.message,
    name: conquestEvent.name,
    icon: conquestEvent.icon,
  }]];
}
  
// Проверяет, можно ли активировать проблему
function canTriggerProblem(problem: stateProblem, state: GameState): boolean {
  // Проверяем, не активирована ли уже эта проблема
  const activeVersion = state.activeProblems.find(p => p.id === problem.id);
  if (!!activeVersion) return false;
  
  return true;
}

// Проверяет проблемы проектов и активирует их при необходимости
function checkProblems(state: GameState, windowSize: { width: number, height: number }): ActiveProblem[] {
  const updatedActiveProblems = [...state.activeProblems];
  
  // Перебираем все активные проекты
  state.activeProjects.forEach(project => {
    const projectData = PROJECTS[project.id];
    
    // Если у проекта есть проблемы и он не завершен, проверяем их
    if (projectData.problems && project.progress < 100) {
      // Выполняем все функции проблем, которые могут добавить новые проблемы в state.problems
      projectData.problems.forEach(problemEffect => problemEffect(state));
    }
  });

  // Проверяем вероятность активации для каждой проблемы из списка
  state.problems.forEach(problem => {
    const problemData = PROBLEMS[problem.id];
    
    if (problemData && canTriggerProblem(problem, state)) {
      // Проверяем шанс на активацию (вес проблемы от 0 до 100%)
      if (Math.random() * 100 < problemData.weight) {
        // Определяем позицию для новой проблемы
        let position: number[];
        if (problemData.position === "random") {
          position = getRandomPosition(windowSize);
        } else {
          position = problemData.position;
        }
        // Добавляем новую проблему
        updatedActiveProblems.push({
          id: problem.id,
          projectId: problem.projectId,
          startTime: Date.now(),
          position,
        });
        
        // Удаляем проблему из списка доступных, чтобы она не активировалась повторно
        state.problems = state.problems.filter(p => p.id !== problem.id);
      }
    }
  });
  
  return updatedActiveProblems;
}

// Функция для обновления списка новостей
function getNewsForState(state: GameState): string[] {
  // Восстанавливаем все новости для текущего и предыдущих этапов
  return Object.keys(NEWS).filter(id => {
    const news = NEWS[id];
    return news.stage === state.stage;
  });
}

// Функция для выбора случайной новости, соответствующей текущему этапу игры
function selectNews(state: GameState): [string | null, string[]] {
  // Если нет новостей вообще, восстанавливаем список
  if (state.newsQueue.length === 0) {
    // В текущем тике не показываем новость
    return ['', getNewsForState(state)];
  }

  // Берем первую новость из очереди и удаляем ее
  const newsId = state.newsQueue[0];
  const newsQueue = state.newsQueue.slice(1);
  return [newsId, newsQueue];

}

// Функция для проверки необходимости отображения новостей
function checkNews(state: GameState): [string | null, string[], number] {
  const now = Date.now();
  let activeNews = state.activeNews;
  let newsQueue = state.newsQueue;
  let lastNewsTime = state.lastNewsTime;
  // Проверяем, прошло ли достаточно времени с момента последнего показа новости
  if (now - state.lastNewsTime > NEWS_INTERVAL) {
    lastNewsTime = now;
    [activeNews, newsQueue] = selectNews(state);
  }
  
  // Выбираем новость для отображения
  return [activeNews, newsQueue, lastNewsTime]  ;
}

export const calculateTick = (state: GameState, deltaTime: number, windowSize: { width: number, height: number }): Partial<GameState> => {
  const updates: Partial<GameState> = {};
  if (state.stage === 0) {
    return updates;
  }

  // Check for stage transition conditions
  if (state.stage === 1) {
    // Check if all countries are conquered
    const allCountriesConquered = COUNTRY_NAMES.every((country: string) => 
      state.conqueredCountries.includes(country)
    );

    // Check if player has enough resources and technology
    const hasEnoughResources = state.total >= TOTAL_RESOURCES_FOR_FIRST_STAGE; // 1 million resources
    const hasEnoughScience = state.spheres[SCIENCE].resources >= SCIENCE_RESOURCES_FOR_FIRST_STAGE; // 500k science
    const hasEnoughFaith = state.spheres[FAITH].resources >= FAITH_RESOURCES_FOR_FIRST_STAGE; // 500k faith
    const hasEnoughEconomy = state.spheres[ECONOMY].resources >= ECONOMY_RESOURCES_FOR_FIRST_STAGE; // 500k economy


    if (allCountriesConquered && 
        hasEnoughResources && 
        hasEnoughScience && 
        hasEnoughFaith && 
        hasEnoughEconomy) {
      updates.stage = 2;
      updates.secondStage = [...state.secondStage, 'space_travel_unlocked'];
    }
  }

  // Update resources based on CPS
  updates.resources = state.resources + state.autoClickPower * state.multipliers[COMMON];
  updates.total = state.total + state.autoClickPower * state.multipliers[COMMON];

  // Update sphere resources
  const updatedSpheres = { ...state.spheres };
  Object.entries(state.spheres).forEach(([sphereName, sphere]) => {
    const sphereCPS = sphere.CPS * state.multipliers[sphereName] * state.multipliers[COMMON];
    updatedSpheres[sphereName as keyof typeof updatedSpheres] = {
      ...sphere,
      resources: sphere.resources + sphereCPS
    };
  });
  updates.spheres = updatedSpheres;

  // Предрасчитываем условия видимости и доступности для талантов
  updates.talents = recalculateTalents(state);
  
  // Предрасчитываем видимость апгрейдов
  updates.upgrades = recalculateUpgrades(state);

  // Обновляем события и удаляем устаревшие
  let newActiveEvents = checkEvents(state, windowSize);
  
  // Проверяем какие события должны быть автоматически удалены по времени
  newActiveEvents = newActiveEvents.filter(eventObj => {
    const eventHistory = state.eventHistory[eventObj.id];
    if (!eventHistory) return true;
    
    const eventAge = Date.now() - eventHistory.lastTriggered;
    // Если событие существует дольше EVENT_AUTO_CLOSE_TIME, удаляем его и применяем эффекты
    if (eventAge >= EVENT_AUTO_CLOSE_TIME) {
      // Удаляем из списка доступных событий, если оно одноразовое
      if (GAME_EVENTS[eventObj.id].once) {
        state.events = state.events.filter(e => e !== eventObj.id);
      }
      
      return false;
    }
    return true;
  });
  
  updates.activeEvents = newActiveEvents;
  
  // Проверяем и обновляем проблемы
  updates.activeProblems = checkProblems(state, windowSize);
  
  // Проверяем и обновляем новости
  [updates.activeNews, updates.newsQueue, updates.lastNewsTime] = checkNews(state);

  
  updates.activeProjects = state.activeProjects;
  
  // Update conquest events
  [updates.lastConquest, updates.mapEvents] = checkConquest(state);

  // Update project progress for active projects
  updates.activeProjects.forEach(project => {
    const projectData = PROJECTS[project.id];
    if (project.status === 'in_progress') {
      const progressIncrement = projectData.speed * state.projectSpeed;
      project.progress = Math.min(100, project.progress + progressIncrement);

      if (project.progress >= 100) {
        // Просто помечаем как успешный, но не применяем эффекты
        // Эффекты будут применены в редьюсере completeProject
        project.status = 'success';
      }
    }
  });

  
  return updates;
};

// Web Worker
/* eslint-disable-next-line no-restricted-globals */
self.onmessage = (e: MessageEvent) => {
  switch (e.data.type) {
    case 'TICK':
      const action = calculateTick(e.data.state, e.data.deltaTime, e.data.windowSize);
      postMessage(action);
      break;
    case 'STATE_UPDATED':
      // Просто запоминаем новое состояние и ничего не отправляем обратно
      // На следующем тике будут использованы актуальные данные
      break;
  }
};
