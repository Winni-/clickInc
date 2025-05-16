import { ECONOMY, FAITH, SCIENCE } from "./app/constants";


// Типы условий
export type Condition = (state: GameState) => boolean;

// Типы эффектов
export type Effect = (state: GameState) => void;

export interface StateTalent {
  id: string;
  isVisible?: boolean;
  isAvailable?: boolean;
  state: 'locked' | 'unlocked' | 'active' | 'hidden';
}

export interface Talent extends StateTalent {
  id: string;
  name: string;
  description?: string;
  category: typeof ECONOMY | typeof FAITH | typeof SCIENCE;
  position: [number, number];
  requires: Array<{
    talentId?: string;
  }>;
  state: 'locked' | 'unlocked' | 'active' | 'hidden';
  visible: Condition[];
  available: Condition[];
  effects: Effect[];
  icon: string;
  meta?: {
    isCrossCategory?: boolean;
    dependencyLinks?: Array<[number, number]>;
  };
  // Предрасчитанные значения для отображения и проверки доступности
  isVisible?: boolean;
  isAvailable?: boolean;
  news?: string;
}

export interface Sphere {
  name: string;
  icon: string;
  CPS: number;
  resources: number;
  count: number;
  baseCPS: number;
}

export interface StateUpgrade {
  id: string;
  // Предрасчитанное значение для отображения
  isVisible?: boolean;
  level: number;
  cost: number;
  CPS: number;
  available: boolean;
}

export interface Upgrade extends StateUpgrade {
  name: string;
  icon: string;
  visible: boolean | Condition;
  spheres: string[];
  cost: number;
  growthRate: number;
  transitionLevel: number;
  linearIncrement: number;
}

export interface CountryStats {}

export interface EventHistory {
  id: string;
  lastTriggered: number;
  count: number;
}

export interface Problem {
  id: string;
  name: string;
  description: string;
  icon: string;
  weight: number;
  amount: number;
  time: number; // in ms
  position: 'random' | [number, number];
}

export interface ActiveProblem {
  id: string;
  projectId: string;
  startTime: number;
  position: number[];
}

export interface stateProblem {
  id: string;
  projectId: string;
}

export interface NewsItem {
  id: string;
  text: string;
  stage: number | 'special'; // 0, 1, 2 или 'special'
}

export interface GameState {
  CPS: number;
  upgrades: StateUpgrade[];
  talents: StateTalent[];
  selectedCountry?: string;
  countries: Record<string, CountryStats>;
  conqueredCountries: string[]; // Array of country IDs conquered by player
  resources: number;
  manualClickPower: number;
  autoClickPower: number;
  spheres: {
    economy: Sphere;
    faith: Sphere;
    science: Sphere;
  };
  multipliers: {
    [entityType: string]: number;
  };
  events: string[];
  activeEvents: {id: string; position: number[]}[];
  eventHistory: Record<string, EventHistory>;
  projects: string[];
  activeProjects: StateProject[];
  problems: stateProblem[];
  activeProblems: ActiveProblem[];
  news: string[];
  newsQueue: string[];
  activeNews: string | null;
  lastNewsTime: number;
  conquestSpeed: number;
  projectSpeed: number;
  secondStage: any[];
  stage: number; // 0 - initial, 1 - earth stage, 2 - space stage
  gameOver: boolean; // Флаг поражения
  gameOverReason?: string; // Причина поражения
  mapEvents: MapEvent[];
  lastConquest: conquestHistory;
  seed: number;
  clickEffects: {
    [entityType: string]: number;
  };
  total: number;
  cosmicCivilization: {
    FTL: boolean;
    conquest: boolean;
    planetShield: boolean;
    shipShield: boolean;
  }
}

export interface StateProject {
  id: string;
  progress: number;
  status: 'in_progress' | 'success' | 'failure';
  completedAt?: number; // Время завершения проекта
  isVisible?: boolean; // Флаг видимости после завершения
}

export interface conquestHistory {
  lastTriggered: number;
  country: string;
}

// Базовая структура события
export interface GameEvent {
  id: string; 
  type: string;
  name: string;
  description: string;
  icon: string;
  position?: [number, number] | "random" ;
  message: string;
  effects: Effect[];
  status?: 'in_progress';
  targetCountry?: string;
  weight: number; // 0 - 100
  conditions: Condition[];
  cooldown?: number;
  once?: boolean;
}

export interface MapEvent {
  id: string;
  name: string;
  description: string;
  icon?: string;
  targetCountry: string;
}

// Тип для статического события или функции-генератора события
export type EventGenerator = ((state: GameState, targetCountry?: string) => GameEvent | null);


export interface Project {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  speed: number;
  status?: 'in_progress' | 'success' | 'failure';
  effects: Effect[];
  failEffects?: Effect[];
  problems?: Effect[];// array of `condition && push(problem)`
}