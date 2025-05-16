import { EventGenerator, GameEvent, GameState } from "./types";
import { SCIENCE, FAITH, ECONOMY, COMMON, MANUAL } from "./app/constants";
import { COUNTRY_NAMES } from "./constants";


// Функция для генерации события захвата страны
function createBuyCountryEvent(state: GameState,target?: string): GameEvent | null {
  // Получаем список незахваченных стран
  const availableCountries = COUNTRY_NAMES.filter(
    countryId => !state.conqueredCountries.includes(countryId)
  );
  
  // Если нет доступных стран, не создаем событие
  if (availableCountries.length === 0) {
    return null;
  }
  
  // Выбираем случайную страну для захвата
  const targetCountry = target || availableCountries[Math.floor(Math.random() * availableCountries.length)];
  
  // Создаем событие для конкретной страны
  return {
    id: "BUY_COUNTRY",
    type: "countryAction",
    name: `${targetCountry} хочет присоедениться`,
    description: "Возможность захватить новую страну",
    icon: "🌍",
    message: "Новая страна готова к захвату!",
    weight: 50,
    conditions: [
      (state) => state.conqueredCountries.length < COUNTRY_NAMES.length
    ],
    effects: [
      (state) => {
        state.conqueredCountries.push(targetCountry);
      }
    ],
    cooldown: 30000,
    status: 'in_progress',
    targetCountry: targetCountry
  };
}
export const DynamicEvents: Record<string, EventGenerator> = {
  "BUY_COUNTRY": createBuyCountryEvent,
};

// Cтатическ события игры
export const GAME_EVENTS: Record<string, GameEvent> = {
  "SCIENTIFIC_BREAKTHROUGH": {
    id: "SCIENTIFIC_BREAKTHROUGH",
    type: "random",
    name: "Ученые совершили прорыв в квантовой физике!",
    description: "Ученые совершили прорыв в квантовой физике!",
    icon: "🧠",
    position: "random",
    message: "Ученые совершили прорыв в квантовой физике!",
    effects: [
      (state) => {
        state.spheres[SCIENCE].resources += 500;
        state.spheres[ECONOMY].resources += 200;
      }
    ],
    weight: 0.1,
    conditions: [
      (state) => state.spheres[SCIENCE].resources > 1000,
    ],
    cooldown: 3600000,
    once: false
  },
  "RELIGIOUS_REVELATION": {
    id: "RELIGIOUS_REVELATION",
    type: "random",
    name: "Явилось божественное знамение!",
    description: "Явилось божественное знамение!",
    icon: "🔱",
    position: "random",
    message: "Явилось божественное знамение!",
    effects: [
      (state) => {
        state.multipliers[FAITH] *= 1.5;
        state.spheres[SCIENCE].resources -= 100;
      }
    ],
    weight: 0.1,
    conditions: [
      (state) => state.spheres[FAITH].resources > 500,
      (state) => state.spheres[SCIENCE].resources < 300
    ],
    cooldown: 3600000,
    once: true
  },
  "RESORCES_DISCOVERY": { 
    id: "RESORCES_DISCOVERY",
    type: "random",
    name: "Были открыты новые ресурсы!",
    description: "Были открыты новые ресурсы!",
    icon: "💰",
    position: "random",
    message: "Были открыты новые ресурсы!",
    effects: [
      (state) => {
        state.resources *=  1.01;
      }
    ],
    weight: 1,
    conditions: [
      (state) => state.resources > 10,
    ],
    cooldown: 1000 * 10,
    once: false
  },
  "RESEARCH_ARTIFACT": {
    id: "RESEARCH_ARTIFACT",
    type: "random",
    name: "Монахи нашли древний священный артефакт!",
    description: "Монахи нашли древний священный артефакт!",
    icon: "🙏🏻",
    position: "random",
    message: "Монахи нашли древний священный артефакт!",
    effects: [
      (state) => {
        state.spheres[FAITH].resources += 1000;
        const artefacts = ['artifact1', 'artifact2', 'artifact3', 'Holy Grail'];
        const randomArtefact = artefacts[Math.floor(Math.random() * artefacts.length)];
        // TODO: news about artefact with image
        if (randomArtefact === 'Holy Grail') {
          state.spheres[FAITH].resources += 10000;
          state.secondStage.push({
            id: "HOLY_GRAIL"})
        }
      },
    ],
    weight: 0.05,
    conditions: [
      (state) => state.activeProjects.some(project => project.id === 'research-artifact'),
    ],
    cooldown: 1000 * 10,
    once: false
  },
  "RESOURCE_BOOST": {
    id: "RESOURCE_BOOST",
    type: "random",
    name: "Увеличение ресурсов",
    description: "Временное увеличение производства ресурсов",
    icon: "📈",
    position: "random",
    message: "Производство ресурсов временно увеличено!",
    effects: [
      (state) => {
        state.multipliers[ECONOMY] *= 1.5;
        state.multipliers[FAITH] *= 1.5;
        state.multipliers[SCIENCE] *= 1.5;
        setTimeout(() => {
          state.multipliers[ECONOMY] /= 1.5;
          state.multipliers[FAITH] /= 1.5;
          state.multipliers[SCIENCE] /= 1.5;
        }, 30000);
      }
    ],
    weight: 0.02,
    conditions: [
      (state) => state.resources > 1000
    ],
    cooldown: 60000,
    once: false
  },
  "OPEN_PLANET": {
    id: "OPEN_PLANET",
    type: "random",
    name: "Открытие новой планеты",
    description: "Открытие новой планеты",
    icon: "🌍",
    position: "random", 
    message: "Открытие новой планеты",
    effects: [
      (state) => {
        //research new planet
      }
    ],
    weight: 0.01,
    conditions: [
      (state) => state.cosmicCivilization.conquest === true
    ],
    cooldown: 1000 * 10,
    once: false
  },
  "GOLD_BAR": { 
    id: "GOLD_BAR",
    type: "random",
    name: "Золотой слиток",
    description: "Золотой слиток",
    icon: "💰",
    position: "random",
    message: "Золотая баржа",
    effects: [
      (state) => {
        state.resources += 10000;
      }
    ],
    weight: 0.01,
    conditions: [
      (state) => state.resources > 10000
    ],
    cooldown: 1000 * 10,
    once: false
  }
};