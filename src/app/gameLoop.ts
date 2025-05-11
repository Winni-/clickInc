import { GameState } from "./gameSlice";
/* eslint-disable-next-line no-restricted-globals */
const ctx: Worker = this as any;

let lastTick = Date.now();

const calculateTick = (state: GameState) => {
  // should one time per second calculate all entities cps and return new gameState?
  const now = Date.now();
  const delta = (now - lastTick) / 1000;
  lastTick = now;

  let totalCPS = 0;

  //Расчет общих автоматических кликов
  totalCPS += state.autoClickPower * state.multipliers.global;

  // Расчет производства для каждого типа объектов
  Object.entries(state.spheres).forEach(([key, entity]) => {
    const cps = entity.count * entity.baseCPS *
      state.multipliers.global *
      state.multipliers[key];
    //i don't think i need the total, i need common and by industry
    totalCPS += cps;
  });

  return {
    type: 'TICK',
    payload: {
      delta: delta,
      resources: totalCPS * delta
    }
  };
};

// Web Worker
ctx.onmessage = (e) => {
  switch (e.data.type) {
    case 'TICK':
      const action = calculateTick(e.data.state);
      ctx.postMessage(action);
  }
};

export default {} as typeof Worker & { new (): Worker };
