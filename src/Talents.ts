import { ECONOMY, FAITH, SCIENCE } from "./app/constants";
import { COUNTRY_NAMES } from "./constants";
import { Talent } from "./types";


// one row is 500 resource

export const TALENTS: Talent[] = [
  {
    id: 'global-trader',
    name: 'Global Trader',
    description: 'Вы покупаете ресурсы в одной стране и продаете в другой на 10% выгоднее',
    category: ECONOMY,
    position: [1, 3],
    requires: [],
    state: 'locked',
    visible: [ () => true],
    available: [ (state) => state.spheres[ECONOMY].resources >= 1500],
    icon: '🌐💰',
    effects: [
      (state) => { state.conquestSpeed += 0.10 },
    ],
  },
  {
    id: 'infrastructure-magnate',
    name: 'Infrastructure Magnate',
    description: 'Усильте вашу инфраструктуру, это увеличит скорость строительства проектов',
    category: ECONOMY,
    position: [1, 5],
    requires: [],
    state: 'locked',
    visible: [ () => true],
    available: [ (state) => state.spheres[ECONOMY].resources >= 2500],
    icon: '👌',
    effects: [
      (state) => { state.projectSpeed += 0.20 }
    ],
  },
  {
    id: 'cooperation-master',
    name: 'Cooperation Master',
    description: 'Вы усиливаете другие сферы',
    category: ECONOMY,
    position: [1, 7],
    requires: [],
    state: 'locked',
    visible: [ () => true],
    available: [ (state) => state.spheres[ECONOMY].resources >= 3500],
    icon: '💸',
    effects: [
      (state) => { state.multipliers[FAITH] += 0.10 },
      (state) => { state.multipliers[SCIENCE] += 0.10 },
    ],
  },
  {
    id: 'cyber-integration',
    name: 'Cyber Integration',
    description: 'Вклад в науку увеличен на 20%',
    category: ECONOMY,
    position: [1, 9],
    requires: [],
    state: 'locked',
    visible: [ () => true],
    available: [ (state) => state.spheres[ECONOMY].resources >= 4500],
    icon: '🧬',
    effects: [
      (state) => { state.multipliers[SCIENCE] += 0.20 }
    ],
  },
  {
    id: 'new-material',
    name: 'New Material',
    description: 'Начать разработку новых материалов',
    category: ECONOMY,
    position: [1, 11],
    requires: [],
    state: 'locked',
    visible: [ () => true],
    available: [ (state) => state.spheres[ECONOMY].resources >= 5500],
    icon: '🧬',
    effects: [
      (state) => { state.activeProjects.push({id: 'new-material', status: 'in_progress', progress: 0}) }
    ],
  },
  {
    id: 'weapon-domination',
    name: 'Weapon Domination',
    description: 'Ваше доминирование в оружии неоспоримо',
    category: ECONOMY,
    position: [1, 13],
    requires: [],
    state: 'locked',
    visible: [ () => true],
    available: [ (state) => state.spheres[ECONOMY].resources >= 6500],
    icon: '🧬',
    effects: [
      (state) => { state.multipliers[ECONOMY] += 0.20 },
      (state) => { state.multipliers[FAITH] += 0.20 },
      (state) => { state.multipliers[SCIENCE] += 0.20 },
    ],
    meta: {
      isCrossCategory: true,
    }
  },
  {
    id: 'antiair-gun',
    name: 'Antiair Gun',
    description: 'Создать пушку, что сможет отклонить снаряд от земли',
    category: ECONOMY,
    position: [1, 15],
    requires: [],
    state: 'locked',
    visible: [ () => true],
    available: [ (state) => state.spheres[ECONOMY].resources >= 7500],
    icon: '💂‍♀️🧬',
    effects: [
      (state) => { state.activeProjects.push({id: 'antiair-gun', status: 'in_progress', progress: 0}) },
      (state) => { 
        state.conqueredCountries.push(
          COUNTRY_NAMES.filter(
            (country) => !state.conqueredCountries.includes(country)
          )
          [Math.floor(Math.random() * COUNTRY_NAMES.length)]
        )
      }
    ],
  },
  {
    id: 'cold-fission',
    name: 'Cold Fission',
    description: 'Вы открываете холодный ядерный синтез',
    category: ECONOMY,
    position: [1, 20],
    requires: [{
      talentId: 'new-material',
    }],
    state: 'locked',
    visible: [ () => true],
    available: [ 
      (state) => state.spheres[ECONOMY].resources >= 10000,
      (state) => state.spheres[SCIENCE].resources >= 10000
    ],
    icon: '☢️🧊',
    effects: [
      (state) => { state.multipliers[ECONOMY] += 0.50 },
      (state) => { state.multipliers[SCIENCE] += 0.50 },
    ],
    meta: {
      isCrossCategory: true,
    }
  },
  {
    id: 'defensive-swarm',
    name: 'Defensive Swarm',
    description: 'Создать рой из спутников на орбите, для защиты от атаки. -1000₿',
    category: SCIENCE,
    position: [2, 2],
    requires: [],
    state: 'locked',
    visible: [ () => true],
    available: [ 
      (state) => state.spheres[SCIENCE].resources >= 1000,
      (state) => state.resources >= 1000,
    ],
    icon: '🛰',
    effects: [
      (state) => { state.resources -= 1000 },
      (state) => { state.multipliers[SCIENCE] += 0.20 },
      (state) => { state.manualClickPower += 10 },
      (state) => { state.conquestSpeed += 0.10 }
    ],
  },
  {
    id: 'dyson-swarm',
    name: 'Dyson Swarm',
    description: 'Создать рой из спутников, вокруг Солнца.',
    category: SCIENCE,
    position: [2, 4],
    requires: [],
    state: 'locked',
    visible: [ () => true],
    available: [ 
      (state) => state.spheres[SCIENCE].resources >= 2000,
    ],
    icon: '🛰',
    effects: [
      (state) => { state.activeProjects.push({id: 'dyson-swarm', status: 'in_progress', progress: 0}) }
    ],
  },
  {
    id: 'dyson-circle',
    name: 'Dyson Circle',
    description: 'Создать кольцо из спутников, вокруг Солнца.',
    category: SCIENCE,
    position: [2, 6],
    requires: [{
      talentId: 'dyson-swarm',
    }],
    state: 'locked',
    visible: [ (state) => state.spheres[SCIENCE].resources >= 2000],
    available: [ 
      (state) => state.spheres[SCIENCE].resources >= 4000,
    ],
    icon: '🛰',
    effects: [
      (state) => { state.activeProjects.push({id: 'dyson-circle', status: 'in_progress', progress: 0}) }
    ],
  },
  {
    id: 'dyson-sphere',
    name: 'Dyson Sphere',
    description: 'Создать сферу из спутников, вокруг Солнца.',
    category: SCIENCE,
    position: [2, 8],
    requires: [{
      talentId: 'dyson-circle',
    }],
    state: 'locked',
    visible: [ (state) => state.spheres[SCIENCE].resources >= 4000],
    available: [ 
      (state) => state.spheres[SCIENCE].resources >= 8000,
      (state) => state.resources >= 10000,
    ],
    icon: '🛰',
    effects: [
      (state) => { state.activeProjects.push({id: 'dyson-sphere', status: 'in_progress', progress: 0}) }
    ],
  },
  {
    id: 'explosion-of-knowledge',
    name: 'Explosion of Knowledge',
    description: 'Ваши ученые обращаются к неизвестным силам, 50% провал, x1000 всего при успехе',
    category: SCIENCE,
    position: [2, 10],
    requires: [],
    state: 'locked',
    visible: [ (state) => {
      return state.spheres[FAITH].resources >= 2500 && state.spheres[SCIENCE].resources >= state.spheres[ECONOMY].resources;
    }],
    available: [ (state) => state.spheres[SCIENCE].resources >= 10000],
    icon: '🤯',
    effects: [
      (state) => { 
        if (Math.random() < 0.5) {
          state.resources += 1000;
          state.spheres[SCIENCE].resources *= 1000;
          state.spheres[FAITH].resources *= 1000;
          state.spheres[ECONOMY].resources *= 1000;
        } else {
          state.resources = 0;
          state.spheres[SCIENCE].resources = 0;
          state.spheres[FAITH].resources = 0;
          state.spheres[ECONOMY].resources = 0;
          state.multipliers[SCIENCE] = 0.01;
          state.multipliers[FAITH] = 0.01;
          state.multipliers[ECONOMY] = 0.01;
          state.conquestSpeed = 0.01;
          state.projectSpeed = 0.01;
          state.manualClickPower = 0.01;
          state.autoClickPower = 0.01;
        }
      },
    ],
  },
  {
    id: 'elexir-of-undying',
    name: 'Elexir of Undying',
    description: 'Создать элексир, который позволит вашим ученым жить вечно.(вера, наука +50%, экономика -50%)',
    category: SCIENCE,
    position: [2, 18],
    requires: [],
    state: 'locked',
    visible: [ (state) => state.spheres[FAITH].resources >= 3000 && state.spheres[SCIENCE].resources >= 3000 && state.spheres[ECONOMY].resources <= 4500],
    available: [ (state) => state.spheres[SCIENCE].resources >= 18000],
    icon: '🧊',
    effects: [
      (state) => { state.multipliers[SCIENCE] += 0.50 },
      (state) => { state.multipliers[FAITH] += 0.50 },
      (state) => { state.multipliers[ECONOMY] -= 0.50 },
    ],
  },
  {
    id: 'hand-of-god',
    name: 'Hand of God',
    description: 'Ваши ручные клики, дают очки в сфере веры',
    category: FAITH,
    position: [3, 2],
    requires: [],
    state: 'locked',
    visible: [ () => true],
    available: [ (state) => state.spheres[FAITH].resources >= 1000],
    icon: '🙏🏻',
    effects: [
      (state) => { 
        state.clickEffects[FAITH] += 1;
      }
    ],
  },
  {
    id: 'research-artifact',
    name: 'Research Artifact',
    description: 'Создать группу монахов, что будут искать древние священные артефакты',
    category: FAITH,
    position: [3, 6],
    requires: [],
    state: 'locked',
    visible: [ () => true],
    available: [ (state) => state.spheres[FAITH].resources >= 3000],
    icon: '🧬',
    effects: [
      (state) => { state.activeProjects.push({id: 'research-artifact', status: 'in_progress', progress: 0}) }
    ],
  },
  {
    id: 'extraterrestrial-search',
    name: 'Extraterrestrial Search',
    description: 'Создать массив спутников и радаров, что будут искать контакт с внеземными цивилизациями',
    category: FAITH,
    position: [3, 8],
    requires: [],
    state: 'locked',
    visible: [ () => true],
    available: [ 
      (state) => state.spheres[FAITH].resources >= 4000,
      (state) => state.spheres[SCIENCE].resources >= 4000
    ],
    icon: '🌌',
    effects: [
      (state) => { state.activeProjects.push({id: 'extraterrestrial-search', status: 'in_progress', progress: 0}) } 
    ],
  },
  {
    id: 'unortodox-experiment',
    name: 'Unortodox Experiment',
    description: 'Используя экспериментальные вещества из котокомб Ватикана, ваши Волхвы расширяют сознание',
    category: FAITH,
    position: [3, 12],
    requires: [{
      talentId: 'extraterrestrial-search',
    }],
    state: 'locked',
    visible: [ (state) => {
      return !!state.secondStage.find((item) => item.id === 'contact');
    }],
    available: [ (state) => state.spheres[FAITH].resources >= 6000],
    icon: '🧊',
    effects: [
      (state) => { state.multipliers[FAITH] += 0.50 },
      (state) => { state.secondStage.push({
        id: 'spice',
        name: 'Spice',
        description: 'Вы можете управлять пространством',
        icon: '🚀',
      }) }
    ],
  },
  {
    id: 'teleportation',
    name: 'Teleportation',
    description: 'Вы открываете телепортацию, вы можете создавать порталы',
    category: FAITH,
    position: [3, 22],
    requires: [],
    state: 'locked',
    visible: [ (state) => {
      return state.seed < 0.05;
    }],
    available: [ (state) => state.spheres[FAITH].resources >= 11000],
    icon: '🚀',
    effects: [
      (state) => { state.secondStage.push({
        id: 'teleportation',
        name: 'Teleportation',
        description: 'Вы открываете телепортацию, вы можете создавать порталы',
        icon: '🚀',
      }) },
    ]
  }
];


