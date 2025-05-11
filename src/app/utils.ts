// File to store same functions from gameLoop and gameState

import { Talent, GameState, Effect } from "../types";
import { Condition } from "../types";

export const applyTalentEffect = (talent: Talent, state: GameState) => {
    // Apply all effects of the talent
    talent.effects.forEach(effect => {
        effect(state);
      });
      
}

// Функция для оценки условий видимости в виде строк
export const evaluateVisibility = (visibilityCondition: boolean | Condition, state: GameState): boolean => {
  if (typeof visibilityCondition === 'boolean') {
    return visibilityCondition;
  }
  return visibilityCondition(state);
}

/**
 * Преобразует эффекты (функции) в читаемые для игрока строки
 * @param effects Массив эффектов (функций)
 * @returns Массив строк с описанием эффектов
 */
export const getEffectsDescription = (effects: Effect[]): string[] => {
  const effectsDescription: string[] = [];
  
  effects.forEach(effect => {
    // Получаем строковое представление функции
    const functionString = effect.toString();
    
    // Поиск увеличения множителей в разных сферах
    if (functionString.includes('multipliers[')) {
      if (functionString.includes('ECONOMY')) {
        // Извлекаем процент
        const match = functionString.match(/\+=\s*([\d.]+)/);
        if (match) {
          const percent = parseFloat(match[1]) * 100;
          effectsDescription.push(`Увеличивает эффективность экономики на <span class="positive">+${percent}%</span>`);
        }
      }
      if (functionString.includes('SCIENCE')) {
        const match = functionString.match(/\+=\s*([\d.]+)/);
        if (match) {
          const percent = parseFloat(match[1]) * 100;
          effectsDescription.push(`Увеличивает эффективность науки на <span class="positive">+${percent}%</span>`);
        }
      }
      if (functionString.includes('FAITH')) {
        const match = functionString.match(/\+=\s*([\d.]+)/);
        if (match) {
          const percent = parseFloat(match[1]) * 100;
          effectsDescription.push(`Увеличивает эффективность веры на <span class="positive">+${percent}%</span>`);
        }
      }
    }
    
    // Скорость завоевания
    if (functionString.includes('conquestSpeed')) {
      const match = functionString.match(/\+=\s*([\d.]+)/);
      if (match) {
        const percent = parseFloat(match[1]) * 100;
        effectsDescription.push(`Увеличивает скорость завоевания на <span class="positive">+${percent}%</span>`);
      }
    }
    
    // Скорость проектов
    if (functionString.includes('projectSpeed')) {
      const match = functionString.match(/\+=\s*([\d.]+)/);
      if (match) {
        const percent = parseFloat(match[1]) * 100;
        effectsDescription.push(`Увеличивает скорость проектов на <span class="positive">+${percent}%</span>`);
      }
    }
    
    // Сила ручного клика
    if (functionString.includes('manualClickPower')) {
      const match = functionString.match(/\+=\s*([\d.]+)/);
      if (match) {
        const value = parseFloat(match[1]);
        effectsDescription.push(`Увеличивает силу клика на <span class="positive">+${value}</span>`);
      }
    }
    
    // Проекты
    if (functionString.includes('activeProjects.push')) {
      const match = functionString.match(/id:\s*'([^']+)'/);
      if (match) {
        const projectId = match[1];
        effectsDescription.push(`Запускает проект "<span class="project">${projectId}</span>"`);
      }
    }
    
    // Завоевание стран
    if (functionString.includes('conqueredCountries.push')) {
      effectsDescription.push(`Завоевывает новую случайную страну`);
    }
    
    // Снятие ресурсов
    if (functionString.includes('resources -=')) {
      const match = functionString.match(/resources\s*-=\s*([\d.]+)/);
      if (match) {
        const cost = parseFloat(match[1]);
        effectsDescription.push(`Стоимость: <span class="cost">${cost}</span> общих ресурсов`);
      }
    }
    
    // Добавление ресурсов
    if (functionString.includes('resources +=')) {
      const match = functionString.match(/resources\s*\+=\s*([\d.]+)/);
      if (match) {
        const gain = parseFloat(match[1]);
        effectsDescription.push(`Получено <span class="positive">+${gain}</span> общих ресурсов`);
      }
    }
  });
  
  // Если не нашли эффектов, добавляем общий эффект
  if (effectsDescription.length === 0) {
    effectsDescription.push('Эффект активирован');
  }
  
  return effectsDescription;
}
