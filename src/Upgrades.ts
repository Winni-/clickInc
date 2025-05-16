import { MANUAL, COMMON, FAITH, SCIENCE, ECONOMY } from "./app/constants";
import { Upgrade, GameState } from "./types";

export const UPGRADES: Upgrade[] = [
    // Базовые апгрейды всегда видимы
    { id: 'cursor',
      level: 0,
      visible: true,
      spheres: [MANUAL],
      available: true,
      name: 'Cursor',
      icon: '👆',
      cost: 10,
      growthRate: 1.15,
      CPS: 1,
      linearIncrement: 500,
      transitionLevel: 50 },
    
    // === COMMON АПГРЕЙДЫ ===
    { id: 'hand',
      level: 0,
      visible: true, // Базовый апгрейд, всегда видимый
      spheres: [COMMON],
      available: true,
      name: 'Hand',
      icon: '💅',
      cost: 10, // Базовая стоимость
      growthRate: 1.15,
      CPS: 0.1,
      linearIncrement: 500,
      transitionLevel: 50 },
    { id: 'factory',
      level: 0,
      visible: (state: GameState) => state.resources >= 50 - 10, // 5 * 10 (стоимость hand)
      spheres: [COMMON],
      available: true,
      name: 'Factory',
      icon: '🏭',
      cost: 100, 
      growthRate: 1.15,
      CPS: 0.5,
      linearIncrement: 500,
      transitionLevel: 50 },
    { id: 'drone',
      level: 0,
      visible: (state: GameState) => state.resources >= 125 - 25, // 5 * 25 (стоимость factory)
      spheres: [COMMON],
      available: true,
      name: 'Drone',
      icon: '🤖',
      cost: 500, 
      growthRate: 1.15,
      CPS: 1.2,
      linearIncrement: 500,
      transitionLevel: 50 },
    { id: 'quantum_forge',
      level: 0,
      visible: (state: GameState) => state.resources >= 310 - 62, // 5 * 62 (стоимость drone)
      spheres: [COMMON],
      available: true,
      name: 'Quantum Forge',
      icon: '⚛️',
      cost: 1000, // 2.5 * 62
      growthRate: 1.15,
      CPS: 3,
      linearIncrement: 500,
      transitionLevel: 50 },
    
    
    
    // === ECONOMY АПГРЕЙДЫ ===
    { id: 'market',
      level: 0,
      visible: true, // Базовый апгрейд экономики, всегда видимый
      spheres: [ECONOMY],
      available: true,
      name: 'Market',
      icon: '🏪',
      cost: 20, // Базовая стоимость
      growthRate: 1.15,
      CPS: 0.3,
      linearIncrement: 500,
      transitionLevel: 50 },
    { id: 'bank',
      level: 0,
      visible: (state: GameState) => {
        return state.resources >= 100 - 20 &&
        state.spheres[ECONOMY].resources >= 100 - 20
      }, // 5 * 20 (стоимость market)
      spheres: [ECONOMY],
      available: true,
      name: 'Bank',
      icon: '🏦',
      cost: 90, // 2.5 * 20
      growthRate: 1.15,
      CPS: 0.8,
      linearIncrement: 500,
      transitionLevel: 50 },
    { id: 'stock_exchange',
      level: 0,
      visible: (state: GameState) => {
        return state.resources >= 250 - 50 &&
        state.spheres[ECONOMY].resources >= 250 - 50
      }, // 5 * 50 (стоимость bank)
      spheres: [ECONOMY],
      available: true,
      name: 'Stock Exchange',
      icon: '📈',
      cost: 250, // 2.5 * 50
      growthRate: 1.15,
      CPS: 2,
      linearIncrement: 500,
      transitionLevel: 50 },
    { id: 'offshore_platform',
      level: 0,
      visible: (state: GameState) => {
        return state.resources >= 625 - 125 &&
        state.spheres[ECONOMY].resources >= 625 - 125
      }, // 5 * 125 (стоимость stock_exchange)
      spheres: [ECONOMY],
      available: true,
      name: 'Offshore Platform',
      icon: '🏗️',
      cost: 400, // 2.5 * 125
      growthRate: 1.15,
      CPS: 5,
      linearIncrement: 500,
      transitionLevel: 50 },
    { id: 'galactic_trade_hub',
      level: 0,
      visible: (state: GameState) => {
        return state.resources >= 1560 - 312 &&
        state.spheres[ECONOMY].resources >= 1560 - 312
      }, // 5 * 312 (стоимость offshore_platform)
      spheres: [ECONOMY],
      available: true,
      name: 'Galactic Trade Hub',
      icon: '🌌',
      cost: 1700, // 2.5 * 312
      growthRate: 1.15,
      CPS: 12.5,
      linearIncrement: 500,
      transitionLevel: 50 },

      // === SCIENCE АПГРЕЙДЫ ===
    { id: 'lab',
      level: 0,
      visible: true, // Базовый апгрейд науки, всегда видимый
      spheres: [SCIENCE],
      available: true,
      name: 'Lab',
      icon: '🧪',
      cost: 15, // Базовая стоимость
      growthRate: 1.15,
      CPS: 0.2,
      linearIncrement: 500,
      transitionLevel: 50 },
    { id: 'satellite',
      level: 0,
      visible: (state: GameState) => {
        return state.resources >= 75 - 15 &&
        state.spheres[SCIENCE].resources >= 75 - 15 
      }, // 5 * 15 (стоимость lab)
      spheres: [SCIENCE],
      available: true,
      name: 'Satellite',
      icon: '🛰️',
      cost: 120, // 2.5 * 15
      growthRate: 1.15,
      CPS: 0.5,
      linearIncrement: 500,
      transitionLevel: 50 },
    { id: 'ai_core',
      level: 0,
      visible: (state: GameState) => {
        return state.resources >= 190 - 38 &&
        state.spheres[SCIENCE].resources >= 190 - 38
      }, // 5 * 38 (стоимость satellite)
      spheres: [SCIENCE],
      available: true,
      name: 'AI Core',
      icon: '🧠',
      cost: 300, // 2.5 * 38
      growthRate: 1.15,
      CPS: 1.3,
      linearIncrement: 500,
      transitionLevel: 50 },
    { id: 'quantum_computer',
      level: 0,
      visible: (state: GameState) => {
        return state.resources >= 475 - 95 &&
        state.spheres[SCIENCE].resources >= 475 - 95
      }, // 5 * 95 (стоимость ai_core)
      spheres: [SCIENCE],
      available: true,
      name: 'Quantum Computer',
      icon: '💻',
      cost: 400, // 2.5 * 95
      growthRate: 1.15,
      CPS: 3.2,
      linearIncrement: 500,
      transitionLevel: 50 },
    { id: 'space_telescope',
      level: 0,
      visible: (state: GameState) => {
        return state.resources >= 1190 - 238 &&
        state.spheres[SCIENCE].resources >= 1190 - 238
      }, // 5 * 238 (стоимость quantum_computer)
      spheres: [SCIENCE],
      available: true,
      name: 'Space Telescope',
      icon: '🔭',
      cost: 1000, // 2.5 * 238
      growthRate: 1.15,
      CPS: 8,
      linearIncrement: 500,
      transitionLevel: 50 },
    
    // === FAITH АПГРЕЙДЫ ===
    { id: 'missionary',
      level: 0,
      visible: true, // Базовый апгрейд веры, всегда видимый
      spheres: [FAITH],
      available: true,
      name: 'Missionary',
      icon: '🙏',
      cost: 2, // Базовая стоимость
      growthRate: 1.8,
      CPS: 0.1,
      linearIncrement: 500,
      transitionLevel: 50 },
    { id: 'temple',
      level: 0,
      visible: (state: GameState) => {
        return state.resources >= 10 - 2 &&
        state.spheres[FAITH].resources >= 10 - 2
      }, // 5 * 2 (стоимость missionary)
      spheres: [FAITH],
      available: true,
      name: 'Temple',
      icon: '🛕',
      cost: 150, // 2.5 * 2
      growthRate: 1.15,
      CPS: 0.25,
      linearIncrement: 500,
      transitionLevel: 50 },
    { id: 'crusader',
      level: 0,
      visible: (state: GameState) => {
        return state.resources >= 25 - 5 &&
        state.spheres[FAITH].resources >= 25 - 5
      }, // 5 * 5 (стоимость temple)
      spheres: [FAITH],
      available: true,
      name: 'Crusader',
      icon: '⚔️',
      cost: 200, // 2.5 * 5
      growthRate: 1.15,
      CPS: 0.6,
      linearIncrement: 500,
      transitionLevel: 50 },
    { id: 'oracle',
      level: 0,
      visible: (state: GameState) => {
        return state.resources >= 60 - 12 &&
        state.spheres[FAITH].resources >= 60 - 12
      }, // 5 * 12 (стоимость crusader)
      spheres: [FAITH],
      available: true,
      name: 'Oracle',
      icon: '👁️',
      cost: 350, // 2.5 * 12
      growthRate: 1.15,
      CPS: 1.5,
      linearIncrement: 500,
      transitionLevel: 50 },
    { id: 'cathedral',
      level: 0,
      visible: (state: GameState) => {
        return state.resources >= 150 - 30 &&
        state.spheres[FAITH].resources >= 150 - 30
      }, // 5 * 30 (стоимость oracle)
      spheres: [FAITH],
      available: true,
      name: 'Cathedral',
      icon: '⛪',
      cost: 600, // 2.5 * 30
      growthRate: 1.15,
      CPS: 3.8,
      linearIncrement: 500,
      transitionLevel: 50 },
  ]
