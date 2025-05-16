import { COMMON, ECONOMY, FAITH, SCIENCE } from "./app/constants";
import { COUNTRY_NAMES } from "./constants";
import { Talent } from "./types";


// one row is 500 resource

// available classes:
// .positive
// .negative
// .project
// .cost
// .economy-req
// .science-req
// .faith-req
// .resource-req
// .talent-name

export const TALENTS: Talent[] = [
  {
    id: 'global-trader',
    name: 'Global Trader',
    description: 'Ваша торговля улучшает взаимотношения с другими странами',
    category: ECONOMY,
    position: [3, 3],
    requires: [],
    state: 'locked',
    visible: [ () => true],
    available: [ (state) => state.spheres[ECONOMY].resources >= 3000, (state) => state.stage < 2],
    icon: '🌐💰',
    effects: [
      (state) => { state.conquestSpeed += 0.10 },
    ],
    meta: {
      effectDesctription: 'Скорость завоевания <span class="positive">+10%</span>',
      requirementsDescription: '<span class="science-req">3000</span> 🧬',
      flavorText: 'Как и было предсказано Зальцманом.',
    }
  },
  {
    id: 'banker',
    name: 'Banker',
    description: 'Развитие экономики дает вам дополнительные ресурсы',
    category: ECONOMY,
    position: [2, 4],
    requires: [],
    state: 'locked',
    visible: [ () => true],
    available: [ (state) => state.spheres[ECONOMY].resources >= 4000, (state) => state.stage < 2],
    shade: [ (state) => state.spheres[ECONOMY].resources < 1000],
    icon: '🏦',
    effects: [
      (state) => { state.autoClickPower += 0.10 }, 
      (state) => { state.multipliers[COMMON] += 0.10 },
    ],
    meta: {
      effectDesctription: 'Добыча ₿ <span class="positive">+10%</span>',
      requirementsDescription: '<span class="economy-req">4000</span> 💸',
    }
  },
  {
    id: 'infrastructure-magnate',
    name: 'Infrastructure Magnate',
    description: 'Усильте вашу инфраструктуру, это увеличит скорость строительства проектов',
    category: ECONOMY,
    position: [2, 5],
    requires: [],
    state: 'locked',
    visible: [ () => true],
    shade: [ (state) => state.spheres[ECONOMY].resources < 3000],
    available: [ (state) => state.spheres[ECONOMY].resources >= 5000, (state) => state.stage < 2],
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
    position: [3, 7],
    requires: [],
    state: 'locked',
    visible: [ () => true],
    shade: [ (state) => state.spheres[ECONOMY].resources < 4000],
    available: [ (state) => state.spheres[ECONOMY].resources >= 7000, (state) => state.stage < 2],
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
    position: [2, 9],
    requires: [],
    state: 'locked',
    visible: [ () => true],
    shade: [ (state) => state.spheres[ECONOMY].resources < 2000],
    available: [ (state) => state.spheres[ECONOMY].resources >= 5000, (state) => state.stage < 2],
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
    position: [2, 11],
    requires: [],
    state: 'locked',
    visible: [ () => true],
    shade: [ (state) => state.spheres[ECONOMY].resources < 6000],
    available: [ (state) => state.spheres[ECONOMY].resources >= 11000, (state) => state.stage < 2],
    icon: '🧬',
    effects: [
      (state) => { state.activeProjects.push({id: 'new-material', status: 'in_progress', progress: 0}) }
    ],
  },
  {
    id: 'banker2',
    name: 'Banker lvl2',
    description: 'Развитие экономики дает вам дополнительные ресурсы',
    category: ECONOMY,
    position: [2, 12],
    requires: [ {
      talentId: 'banker',
    }],
    state: 'locked',
    visible: [ () => true],
    shade: [ (state) => state.spheres[ECONOMY].resources < 10000],
    available: [ (state) => state.spheres[ECONOMY].resources >= 12000, (state) => state.stage < 2],
    icon: '🏦',
    effects: [
      (state) => { state.autoClickPower += 200 },
      (state) => { state.multipliers[COMMON] += 0.20 },
    ],
  },
  {
    id: 'weapon-domination',
    name: 'Weapon Domination',
    description: 'Ваше доминирование в оружии неоспоримо',
    category: ECONOMY,
    position: [3, 13],
    requires: [],
    state: 'locked',
    visible: [ () => true],
    shade: [ (state) => state.spheres[ECONOMY].resources < 9000],
    available: [ (state) => state.spheres[ECONOMY].resources >= 13000, (state) => state.stage < 2],
    icon: '🧬',
    effects: [
      (state) => { state.multipliers[ECONOMY] += 0.20 },
      (state) => { state.multipliers[FAITH] += 0.20 },
      (state) => { state.multipliers[SCIENCE] += 0.20 },
      (state) => { state.conquestSpeed += 0.50 },
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
    position: [2, 15],
    requires: [],
    state: 'locked',
    visible: [ (state) => state.spheres[ECONOMY].resources >= 9000],
    shade: [ (state) => state.spheres[ECONOMY].resources < 12000],
    available: [ (state) => state.spheres[ECONOMY].resources >= 15000, (state) => state.stage < 2],
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
    id: 'Brutal-force',
    name: 'Brutal Force',
    description: 'Перед вами трепещут от вашей силы, несколько стран идут к вам добровольно',
    category: ECONOMY,
    position: [2, 25],
    requires: [],
    state: 'locked',
    visible: [ (state) => state.spheres[ECONOMY].resources >= 10000],
    shade: [ (state) => state.spheres[ECONOMY].resources < 16000],
    available: [ (state) => state.spheres[ECONOMY].resources >= 25000, (state) => state.stage < 2],
    icon: '💪',
    effects: [
      (state) => { state.conquestSpeed += 0.50 },
      (state) => { state.multipliers[SCIENCE] -= 0.50 },
      (state) => { 
        state.conqueredCountries.push(
          ...COUNTRY_NAMES.filter(
            (country) => !state.conqueredCountries.includes(country)
          ).slice(0, Math.floor(Math.random() * 45)+5) // 5-50 стран
        )
       },
    ],
  },
  {
    id: 'cold-fission',
    name: 'Cold Fission',
    description: 'Вы открываете холодный ядерный синтез',
    category: ECONOMY,
    position: [3, 20],
    requires: [{
      talentId: 'new-material',
    }],
    state: 'locked',
    visible: [ (state) => state.spheres[ECONOMY].resources >= 14000],
    shade: [ (state) => state.spheres[ECONOMY].resources < 16000],
    available: [ 
      (state) => state.spheres[ECONOMY].resources >= 20000,
      (state) => state.spheres[SCIENCE].resources >= 10000,
      (state) => state.stage < 2,
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
    id: 'science-freak',
    name: 'Science Freak',
    description: 'Наука это наш путь к победе',
    category: SCIENCE,
    position: [4, 2],
    requires: [],
    state: 'locked',
    visible: [ () => true],
    available: [ (state) => state.spheres[SCIENCE].resources >= 2000, (state) => state.stage < 2],
    icon: '🧬',
    effects: [
      (state) => { state.multipliers[SCIENCE] += 0.50 },
    ],
  },
  {
    id: 'defensive-swarm',
    name: 'Defensive Swarm',
    description: 'Создать рой из спутников на орбите, для защиты от атаки. -1000₿',
    category: SCIENCE,
    position: [4, 10],
    requires: [],
    state: 'locked',
    visible: [ () => true],
    available: [ 
      (state) => state.spheres[SCIENCE].resources >= 10000,
      (state) => state.resources >= 1000,
      (state) => state.stage < 2,
    ],
    shade: [ (state) => state.spheres[SCIENCE].resources < 2000],
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
    position: [4, 14],
    requires: [],
    state: 'locked',
    visible: [ () => true],
    available: [ 
      (state) => state.spheres[SCIENCE].resources >= 14000,
      (state) => state.stage < 2,
    ],
    shade: [ (state) => state.spheres[SCIENCE].resources < 4500],
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
    position: [4, 18],
    requires: [{
      talentId: 'dyson-swarm',
    }],
    state: 'locked',
    visible: [ (state) => state.spheres[SCIENCE].resources >= 5000],
    shade: [ (state) => state.spheres[SCIENCE].resources < 1300],
    available: [ 
      (state) => state.spheres[SCIENCE].resources >= 18000,
      (state) => state.stage < 2,
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
    position: [4, 22],
    requires: [{
      talentId: 'dyson-circle',
    }],
    state: 'locked',
    visible: [ (state) => state.spheres[SCIENCE].resources >= 9000],
    shade: [ (state) => state.spheres[SCIENCE].resources < 17000],
    available: [ 
      (state) => state.spheres[SCIENCE].resources >= 22000,
      (state) => state.resources >= 10000,
      (state) => state.stage < 2,
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
    position: [4, 10],
    requires: [],
    state: 'locked',
    visible: [ (state) => {
      return state.spheres[FAITH].resources >= 2500 && state.spheres[SCIENCE].resources >= state.spheres[ECONOMY].resources;
    }],
    available: [ (state) => state.spheres[SCIENCE].resources >= 10000, (state) => state.stage < 2],
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
    id: 'transmutation',
    name: 'Transmutation',
    description: 'Превратить немного свинца в золото',
    category: SCIENCE,
    position: [4, 12],
    requires: [],
    state: 'locked',
    visible: [ () => true],
    available: [ (state) => state.spheres[SCIENCE].resources >= 12000, (state) => state.stage < 2],
    icon: '🧊',
    effects: [
      (state) => { state.resources += 7000 },
    ],
  },
  {
    id: 'science-freak2',
    name: 'Science Freak lvl2',
    description: 'Только наука может спасти нас',
    category: SCIENCE,
    position: [4, 26],
    requires: [],
    state: 'locked',
    visible: [ (state) => state.spheres[SCIENCE].resources >= 12000],
    shade: [ (state) => state.spheres[SCIENCE].resources < 20000],
    available: [ (state) => state.spheres[SCIENCE].resources >= 26000, (state) => state.stage < 2],
    icon: '🧬',
    effects: [
      (state) => { state.multipliers[SCIENCE] += 0.50 },
      (state) => { state.spheres[FAITH].resources > 10000 && (state.spheres[FAITH].resources -= 5000)  },
      (state) => { state.spheres[ECONOMY].resources > 10000 && (state.spheres[ECONOMY].resources -= 5000)  },
    ],
  },
  {
    id: 'human-experiment',
    name: 'Human Experiment',
    description: 'Разрешить ученым проводить эксперименты на людях',
    category: SCIENCE,
    position: [4, 28],
    requires: [],
    state: 'locked',
    visible: [ (state) => state.spheres[SCIENCE].resources >= 15000],
    shade: [ (state) => state.spheres[SCIENCE].resources < 22000],
    available: [ (state) => state.spheres[SCIENCE].resources >= 28000, (state) => state.stage < 2],
    icon: '🧬',
    effects: [
      (state) => { state.multipliers[SCIENCE] += 0.50 },
      (state) => { state.projectSpeed += 2 },
      (state) => { state.conquestSpeed += 2 },
      (state) => { state.manualClickPower *= 2 },
      (state) => { state.autoClickPower *= 2 },
      (state) => { state.spheres[FAITH].resources > 10000 && (state.spheres[FAITH].resources -= 5000)  },
      (state) => { state.multipliers[ECONOMY] -= 0.50 },
    ],
    meta: {
      effectDesctription: 'Наука <span class="positive">+50%</span>,<br />скорость проектов <span class="positive">+ х2</span>,<br /> скорость завоевания <span class="positive">+ х2</span>,<br /> клики <span class="positive">х2</span>,<br /> экономика <span class="negative">-50%</span>,<br /> вера <span class="positive">+50%</span>',
      requirementsDescription: '<span class="science-req">28000<span>🧬',
      flavorText: 'Это может привести к гибели многих людей, но в скором времени мы сможем спасти их всех',
    }
  },
  {
    id: 'robots',
    name: 'Robots',
    description: 'Последнее слово робототехники',
    category: SCIENCE,
    position: [4, 35],
    requires: [],
    state: 'locked',
    visible: [ (state) => state.spheres[SCIENCE].resources >= 25000],
    shade: [ (state) => state.spheres[SCIENCE].resources < 31000],
    available: [ (state) => state.spheres[SCIENCE].resources >= 35000,
     (state) => state.spheres[ECONOMY].resources >= 10000,
     (state)=>state.resources > 10000,
      (state) => state.stage < 2
    ],
    icon: '🤖',
    effects: [
      (state) => { state.projectSpeed += 2 },
    ],
    meta: {
      effectDesctription: 'Скорость проектов <span class="positive">+2</span>',
      requirementsDescription: '<span class="science-req">35000<span>🧬, <br /> <span class="economy-req">10000<span>💸, <br /> <span class="resources-req">10000<span>💰',
      flavorText: 'Тут нам не обойтись без денег',
    }
  },
  // При 75% науки, таланты смещаются в веру и требуют столько же веры
  {
    id: 'summon-knowledge',
    name: 'Summon Knowledge',
    description: 'Призвать знания из неизвестных источников',
    category: SCIENCE,
    position: [5, 38],
    requires: [],
    state: 'locked',
    visible: [ (state) => state.spheres[SCIENCE].resources >= 35000, (state) => state.spheres[FAITH].resources >= 35000],
    shade: [ (state) => state.spheres[SCIENCE].resources < 41000],
    available: [ (state) => state.spheres[FAITH].resources >= 38000, (state) => state.spheres[FAITH].resources >= 38000, (state) => state.stage < 2],
    icon: '🧬',
    effects: [
      (state) => { state.multipliers[SCIENCE] += 0.50 },
      (state) => { state.multipliers[FAITH] += 0.50 },
      (state) => { state.multipliers[ECONOMY] -= 0.50 },
      (state) => { state.projectSpeed += [10,100,1000][Math.floor(Math.random() * 3)] },
    ],
    meta: {
      effectDesctription: 'Наука <span class="positive">+50%</span>,<br />Вера <span class="positive">+50%</span>,<br />Экономика <span class="negative">-50%</span>,<br />Скорость проектов <span class="positive">+10-100-1000</span>',
      requirementsDescription: '<span class="science-req">35000<span>🧬, <br /> <span class="faith-req">35000<span>🙏🏻',
      flavorText: 'Это оно?',
    }
  },
  {
    id: 'quark-control',
    name: 'Quark Control',
    description: 'Эксперименты в коллайдеры принесли свои плоды, мы можем создавать любую материю, которая нам нужна',
    category: SCIENCE,
    position: [5, 40],
    requires: [ {
      talentId: 'new-materials',
    }],
    state: 'locked',
    visible: [ (state) => state.spheres[SCIENCE].resources >= 35000, (state) => state.spheres[FAITH].resources >= 35000],
    shade: [ (state) => state.spheres[SCIENCE].resources < 40000],
    available: [ (state) => state.spheres[SCIENCE].resources >= 40000, (state) => state.spheres[FAITH].resources >= 40000, (state) => state.stage < 2],
    icon: '🧬',
    effects: [
      (state) => { state.projectSpeed *= 2 },
    ],
    meta: {
      effectDesctription: 'Скорость проектов <span class="positive">х2</span>',
      requirementsDescription: '<span class="science-req">40000<span>🧬, <br /> <span class="faith-req">40000<span>🙏🏻',
    }
  },
  {
    id: 'elexir-of-undying',
    name: 'Elexir of Undying',
    description: 'Создать элексир, который позволит вашим ученым жить вечно.(вера, наука +50%, экономика -50%)',
    category: SCIENCE,
    position: [4, 18],
    requires: [],
    state: 'locked',
    visible: [ (state) => state.spheres[FAITH].resources >= 3000 && state.spheres[SCIENCE].resources >= 3000 && state.spheres[ECONOMY].resources <= 4500],
    shade: [ (state) => state.spheres[SCIENCE].resources < 10000],
    available: [ (state) => state.spheres[SCIENCE].resources >= 18000, (state) => state.stage < 2],
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
    position: [6, 2],
    requires: [],
    state: 'locked',
    visible: [ () => true],
    available: [ (state) => state.spheres[FAITH].resources >= 2000, (state) => state.stage < 2],
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
    position: [6, 6],
    requires: [],
    state: 'locked',
    visible: [ () => true],
    available: [ (state) => state.spheres[FAITH].resources >= 6000, (state) => state.stage < 2],
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
    position: [6, 8],
    requires: [],
    state: 'locked',
    visible: [ () => true],
    available: [ 
      (state) => state.spheres[FAITH].resources >= 8000,
      (state) => state.spheres[SCIENCE].resources >= 4000,
      (state) => state.stage < 2,
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
    position: [6, 12],
    requires: [{
      talentId: 'extraterrestrial-search',
    }],
    state: 'locked',
    visible: [ (state) => {
      return !!state.secondStage.find((item) => item.id === 'contact');
    }],
    available: [ (state) => state.spheres[FAITH].resources >= 12000, (state) => state.stage < 2],
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
    id: 'teleportation',// stargate ref
    name: 'Teleportation',
    description: 'Вы открываете телепортацию, вы можете создавать порталы',
    category: FAITH,
    position: [6, 22],
    requires: [],
    state: 'locked',
    visible: [ (state) => {
      if (state.secondStage.find((item) => item.id === 'holygrail')) {// TODO: check artefact name
        return Math.random() < 0.90;
      }
      return state.seed < 0.05;
    }],
    available: [ (state) => state.spheres[FAITH].resources >= 22000, (state) => state.stage < 2],
    icon: '🚀',
    effects: [
      (state) => { state.secondStage.push({
        id: 'teleportation',
        name: 'Teleportation',
        description: 'Вы открываете телепортацию, вы можете создавать порталы',
        icon: '🚀',
      }) },
    ]
  },
  {
    id: 'strange-dust',
    name: 'Strange dust',
    description: 'Удивительное вещество, может ли оно стать ответом на наши вопросы? Проведем эксперименты',
    category: FAITH,
    position: [6, 24],
    requires: [],
    state: 'locked',
    visible: [ (state) => {
      return state.seed > 0.05 && state.seed < 0.25;
    }],
    available: [ (state) => state.spheres[FAITH].resources >= 24000, (state) => state.stage < 2],
    icon: '🔥',
    effects: [
      (state) => { 
        state.activeProjects.push({
          id: 'strange-dust',
          progress: 0,
          status: 'in_progress',
        })
      },
    ],
  },
  {
    id: 'triumvirate',
    name: 'Triumvirate',
    description: 'Равномерное развитие всех сфер очень привлекательно для других стран',
    category: SCIENCE,
    position: [4, 22],
    requires: [],
    state: 'locked',
    visible: [ 
      (state) => state.spheres[FAITH].resources >= 1000,
      (state) => state.spheres[ECONOMY].resources >= 1000,
      (state) => state.spheres[SCIENCE].resources >= 1000,
    ],
    available: [ 
      (state) => state.spheres[SCIENCE].resources >= 22000,
      (state) => state.spheres[ECONOMY].resources >= 5000,
      (state) => state.spheres[ECONOMY].resources <= 20000,
      (state) => state.spheres[FAITH].resources >= 5000,
      (state) => state.spheres[FAITH].resources <= 20000,
      (state) => state.stage < 2,
    ],
    icon: '🚀',
    effects: [
      (state) => { state.conquestSpeed += 10 },
    ],
    meta: {
      isCrossCategory: true,
    }
  },
  // second stage
  {
    id: 'nanoshield',
    name: 'Nanoshield',
    description: 'Разработать щит, защищающий корабль от опасностей при быстром перемещении',
    category: SCIENCE,
    position: [4, 55],
    requires: [],
    state: 'locked',
    visible: [ (state) => {
      return state.stage >= 2;
    }],
    available: [ (state) => state.spheres[SCIENCE].resources >= 55000],
    icon: '🌌',
    effects: [
      (state) => { state.activeProjects.push({
        id: 'nanoshield',
        progress: 0,
        status: 'in_progress',
      }) },
    ],
  },
  {
    id: 'spice-shield',
    name: 'Spice Shield',
    description: 'Разработать щит, защищающий корабль от опасностей при быстром перемещении',
    category: FAITH,
    position: [6, 55],
    requires: [],
    state: 'locked',  
    visible: [ (state) => {
      return state.stage >= 2;
    },
    (state) => {
      return state.secondStage.find((item) => item.id === 'spice');
    }
    ],
    available: [ (state) => state.spheres[FAITH].resources >= 55000],
    icon: '🌌',
    effects: [
      (state) => { state.activeProjects.push({
        id: 'spice-shield',
        progress: 0,
        status: 'in_progress',
      }) },
    ],
  },
  {
    id: 'Genetic-memory',
    name: 'Genetic Memory',
    description: 'Благодаря специи, ваши провидцы извлекают знания предков',
    category: FAITH,
    position: [6, 60],
    requires: [],
    state: 'locked',
    visible: [ (state) => {
      return state.secondStage.find((item) => item.id === 'spice');
    }],
    available: [ (state) => state.spheres[FAITH].resources >= 60000],
    icon: '🌌',
    effects: [
      (state) => { 
        // TODO: add postGame effect
        state.multipliers[FAITH] += 0.5;
      },
    ],
  },
  {
    id: 'foresight',
    name: 'Foresight',
    description: 'Вы можете предвидеть будущие проблемы',
    category: FAITH,
    position: [6, 65],  
    requires: [],
    state: 'locked',
    visible: [ (state) => {
      return state.secondStage.find((item) => item.id === 'spice');
    }],
    available: [ (state) => state.spheres[FAITH].resources >= 65000],
    icon: '🌌',
    effects: [
      (state) => { 
        // TODO: add more time for problems
        state.multipliers[FAITH] += 0.5;
      },
    ],
  },
  {
    id: 'quantum-beacon',
    name: 'Quantum Beacon',
    description: 'Вы можете создавать квантовые порталы',
    category: SCIENCE,
    position: [4, 70],
    requires: [],
    state: 'locked',
    visible: [ (state) => {
      return state.secondStage.find((item) => item.id === 'quantum-threads');
    }],
    available: [ (state) => state.spheres[SCIENCE].resources >= 70000],
    icon: '🌌',
    effects: [
      (state) => {  
        state.activeProjects.push({
          // Открывает возможность захватывать планеты
          id: 'quantum-beacon',
          progress: 0,
          status: 'in_progress',
        })
      },
    ],
  },
  {
    id: 'space-folding-engine',
    name: 'Space Folding Engine',
    description: 'Разработка двигателя, позволяющего перемещаться быстрее скорости света',
    category: SCIENCE,
    position: [4, 75],
    requires: [],
    state: 'locked',
    visible: [ (state) => {
      return state.secondStage.find((item) => item.id === 'dark-matter' || item.id === 'spice' || item.id === 'negative-mass-matter');
    }],
    available: [ (state) => state.spheres[SCIENCE].resources >= 75000],
    icon: '🌌',
    effects: [
      (state) => {  
        state.activeProjects.push({
          id: 'space-folding-engine',
          progress: 0,
          status: 'in_progress',
        })
      },
    ],
  },
  {
    id: 'white-hole',
    name: 'Чревоточина',
    description: 'Ваши разработки позволяют нам создать одну чревоточину, сразу до планеты врага! Так можно обойтись без щитов. Но у нас одна попытка!',
    category: ECONOMY,
    position: [2, 55],
    requires: [
      {
        talentId: 'cold-fission', 
      }
    ],
    state: 'locked',
    visible: [ (state) => {
      return state.secondStage.find((item) => item.id === 'negative-mass-matter');
    }],
    available: [ (state) => state.spheres[ECONOMY].resources >= 55000],
    icon: '🌌',
    effects: [
      (state) => {  
        state.activeProjects.push({
          id: 'white-hole',
          progress: 0,
          status: 'in_progress',
        })
      },
    ],
  },
  {
    id: 'big-fold',
    name: 'Складывание пространства от планеты к планете',
    description: 'Ваши разработки позволяют нам создать изменить пространство, мы сможем попасть к ним даже без короблей! Но у нас одна попытка!',
    category: ECONOMY,
    position: [2, 55],
    requires: [
      {
        talentId: 'cold-fission', 
      }
    ],
    state: 'locked',
    visible: [ (state) => {
      return state.secondStage.find((item) => item.id === 'dark-matter' );
    }],
    available: [ (state) => state.spheres[ECONOMY].resources >= 55000],
    icon: '🌌',
    effects: [
      (state) => {  
        state.activeProjects.push({
          id: 'big-fold',
          progress: 0,
          status: 'in_progress',
        })
      },
    ],
  },
  {
    id: 'obsidian-portal',
    name: 'Портал в неизвестность',
    description: 'Вы можете открывать порталы в другое измерение, чтобы перемещаться между планетами',
    category: FAITH,
    position: [6, 55],
    requires: [],
    state: 'locked',
    visible: [ (state) => {
      return state.secondStage.find((item) => item.id === 'dark-matter');
    }],
    available: [ (state) => state.spheres[ECONOMY].resources >= 55000],
    icon: '🌌',
    effects: [  
      (state) => {  
        state.activeEvents.push({
          id: 'open-planet',
          position: [0,0],
        })
      },
      (state) => {
        state.cosmicCivilization.conquest = true;
        state.cosmicCivilization.FTL = true;
      },
    ],
  },
  {
    id: 'xenophilia',
    name: 'Сотрудничество с инопланетянами',
    description: 'Взаимодействие с инопланетянами оказывает плодотворный эффект',
    category: FAITH,
    position: [6, 90],
    requires: [],
    state: 'locked',
    visible: [ (state) => {
      return state.secondStage.find((item) => item.id === 'contact');
    }],
    available: [ (state) => state.spheres[FAITH].resources >= 90000],
    icon: '🌌',
    effects: [
      (state) => {  
        state.multipliers[FAITH] += 1;
        state.multipliers[ECONOMY] += 1;
        state.multipliers[SCIENCE] += 1;
        state.multipliers[COMMON] += 7;
      },
    ],
  },
  {
    id: 'holy-shield',
    name: 'Священный щит',
    description: 'Из подвалов Антиохии, вышли священники, заявляют что могут создать щит, защищающий любой корабль от космического мусора и излучения',
    category: FAITH,
    position: [6, 85],
    requires: [],
    state: 'locked',
    visible: [ (state) => state.spheres[FAITH].resources >= 55000],
    available: [ (state) => state.spheres[FAITH].resources >= 85000],
    icon: '🌌',
    effects: [
      (state) => {  
        state.cosmicCivilization.shipShield = true;
      },
    ],
  },

];


