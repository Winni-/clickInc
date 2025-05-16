import { ECONOMY, FAITH, SCIENCE } from "./app/constants";
import { Project } from "./types";



export const Projects: Record<string, Project> = {
    'research-lab': {
        id: 'research-lab',
        name: 'Research Lab',
        description: 'A facility dedicated to scientific research and development.',
        icon: '🔬',
        progress: 0,
        speed: 1,
        effects: [
            (state) => state.multipliers[SCIENCE] += 0.2 
        ],
        failEffects: [
            (state) => state.resources -= 100 
        ],
        problems: [
            (state) => {
                if (state.spheres[FAITH].resources > 1000) {
                    state.problems.push({
                        id: 'religios-fanatics',
                        projectId: 'research-lab'
                    });
                }
            }
        ]
    },
    'advanced-research-lab': {
        id: 'advanced-research-lab',
        name: 'Advanced Research Lab',
        description: 'An upgraded research facility with cutting-edge equipment.',
        icon: '🧪',
        progress: 0,
        speed: 1,
        effects: [
            (state) => state.multipliers[SCIENCE] += 0.30,
            
        ],
        failEffects: [
            (state) => state.resources -= 200 
        ],
        problems: [
            (state) => {
                if (state.spheres[FAITH].resources > 10000) {
                    state.problems.push({
                        id: 'religios-fanatics',
                        projectId: 'advanced-research-lab'
                    });
                }
            }
        ]
    },
    'global-security-system': {
        id: 'global-security-system',
        name: 'Глобальная система безопасности',
        description: 'Система, обеспечивающая безопасность всего человечества. Провал приведет к катастрофе!',
        icon: '🛡️',
        progress: 0,
        speed: 0.5, // Медленный прогресс
        effects: [
            (state) => state.multipliers[SCIENCE] += 0.50,
            (state) => state.multipliers[ECONOMY] += 0.30,
            (state) => state.multipliers[FAITH] += 0.30
        ],
        failEffects: [
            (state) => state.resources -= 1000
        ],
        problems: [
            (state) => {
                if (state.spheres[ECONOMY].resources > 10000) {
                    state.problems.push({
                        id: 'libs',
                        projectId: 'global-security-system'
                    });
                }
            }
        ]
        
    },
    'new-material': {
        id: 'new-material',
        name: 'New Material',
        description: 'Начать разработку новых материалов',
        icon: '🧬',
        progress:0,
        speed: 0.01,
        effects: [
            (state) => {
                const materials = ['nanotubes', 'quantum-threads', 'dark-matter', 'negative-mass-matter'];
                const randomMaterial = materials[Math.floor(Math.random() * materials.length)];
                state.secondStage.push(randomMaterial);
            },  
        ],
        failEffects: [
            (state) => state.resources -= 3000
        ]
    },
    'antiair-gun': {
        id: 'antiair-gun',
        name: 'Antiair Gun',
        description: 'Создать пушку, что сможет отклонить снаряд от земли',
        icon: '💂‍♀️🧬',
        progress: 0,
        speed: 0.004,
        effects: [
            (state) => state.multipliers[ECONOMY] += 0.20,
            (state) => state.secondStage.push('antiair-gun')
        ],
        failEffects: [
            (state) => state.resources -= 4000
        ],
        problems: [
            (state) => {
                if (state.conqueredCountries.length < 25) {
                    state.problems.push({
                        id: 'antigun',
                        projectId: 'antiair-gun'    
                    });
                }
            }
        ]
    },
    'dyson-swarm': {
        id: 'dyson-swarm',
        name: 'Dyson Swarm',
        description: 'Создать рой из спутников, вокруг Солнца.',
        icon: '🛰',
        progress: 0,
        speed: 0.5,
        effects: [
            (state) => state.multipliers[SCIENCE] += 0.20,
            (state) => state.secondStage.push('dyson-swarm')
        ],
        failEffects: [
            (state) => state.resources -= 1000
        ]
    },
    'dyson-circle': {
        id: 'dyson-circle',
        name: 'Dyson Circle',
        description: 'Создать кольцо из спутников, вокруг Солнца.',
        icon: '🛰',
        progress: 0,
        speed: 0.04,
        effects: [
            (state) => state.multipliers[SCIENCE] += 0.50,
            (state) => state.secondStage.push('dyson-circle')
        ],
        failEffects: [
            (state) => state.resources -= 5000,
            (state) => state.conquestSpeed -= 0.50
        ],
        problems: [
            (state) => {
                if (state.seed > 0.9) {
                    state.problems.push({
                        id: 'gravitation',
                        projectId: 'dyson-circle'
                    });
                }
            }
        ]
    },
    'dyson-sphere': {
        id: 'dyson-sphere',
        name: 'Dyson Sphere',
        description: 'Создать сферу из спутников, вокруг Солнца.',
        icon: '🛰',
        progress: 0,
        speed: 0.001,
        effects: [
            (state) => state.multipliers[SCIENCE] += 2,
            (state) => state.secondStage.push('dyson-sphere')
        ],
        failEffects: [
            (state) => state.resources -= 10000,
            (state) => state.conquestSpeed -= 0.50
        ],
        problems: [
            (state) => {
                if (state.seed > 0.9) {
                    state.problems.push({
                        id: 'gravitation',
                        projectId: 'dyson-sphere'
                    });
                }
            }
        ]
    },
    'research-artifact': {
        id: 'research-artifact',
        name: 'Research Artifact',
        description: 'Создать группу монахов, что будут искать древние священные артефакты',
        icon: '🧬',
        progress: 0,
        speed: 0.00006,
        effects: [
            // will turn RESEARCH_ARTIFACT on
        ],
        failEffects: [
            (state) => state.resources -= 1500
        ],
        problems: [
            (state) => {
                if (state.spheres[ECONOMY].resources > 10000) {
                    state.problems.push({
                        id: 'capitalists',
                        projectId: 'research-artifact'
                    });
                }
            }
        ]
    },
    'extraterrestrial-search': {
        id: 'extraterrestrial-search',
        name: 'Extraterrestrial Search',
        description: 'Создать массив спутников и радаров, что будут искать контакт с внеземными цивилизациями',
        icon: '🌌',
        progress: 0,
        speed: 0.000001,
        effects: [
            (state) => {
                if (Math.random() < 0.5) {
                    state.secondStage.push('contact')
                    state.newsQueue.push('special-contact');
                }
            }
        ],
        failEffects: [
            (state) => state.resources -= 2000
        ],
        problems: [
            (state) => {
                if (state.spheres[ECONOMY].resources > 10000) {
                    state.problems.push({
                        id: 'capitalists',
                        projectId: 'extraterrestrial-search'
                    });
                }
                state.problems.push({
                    id: 'rationalists',
                    projectId: 'extraterrestrial-search'
                });
            }
        ]
    },
    'strange-dust': {
        id: 'strange-dust',
        name: 'Strange Dust',
        description: 'Проводится эксперимент по созданию странного вещества, которое может стать ответом на наши вопросы',
        icon: '🧬',
        progress: 0,
        speed: 0.2,
        effects: [
            (state) => state.secondStage.push('spice')
        ],
        failEffects: [
            (state) => state.resources -= 1500
        ],
        problems: [
            (state) => {
                
                state.problems.push({
                    id: 'spice-explosion',
                    projectId: 'strange-dust'
                });
                state.problems.push({
                    id: 'spice-empty',
                    projectId: 'strange-dust'
                });
            }
        ]
    },
    'nanoshield': {
        id: 'nanoshield',
        name: 'Nanoshield',
        description: 'Создать щит, защищающий корабль от опасностей при быстром перемещении',
        icon: '🌌',
        progress: 0,
        speed: 0.5,
        effects: [
            (state) => state.cosmicCivilization.shipShield = true
        ],
        failEffects: [

        ],
        problems: [

        ]
    },
    'spice-shield': {
        id: 'spice-shield',
        name: 'Spice Shield',
        description: 'Создать щит, защищающий корабль от опасностей при быстром перемещении',
        icon: '🌌',
        progress: 0,
        speed: 0.5,
        effects: [
            (state) => state.cosmicCivilization.shipShield = true
        ],
        failEffects: [
            (state) => state.resources -= 1500
        ],
        problems: [
            
        ]
    },
    'quantum-beacon': {
        id: 'quantum-beacon',
        name: 'Quantum Beacon',
        description: 'Создание квантовых маяков, что позволит нам перемещаться между планетами',
        icon: '🌌',
        progress: 0,
        speed: 0.1,
        effects: [
            (state) => state.cosmicCivilization.conquest = true
        ],
        failEffects: [

        ],
        problems: [
            
        ]
    },
    'space-folding-engine': {
        id: 'space-folding-engine',
        name: 'Space Folding Engine',
        description: 'Создание двигателя, что позволит нам перемещаться между планетами',
        icon: '🌌',
        progress: 0,
        speed: 0.1,
        effects: [
            (state) => state.cosmicCivilization.FTL = true
        ],
        failEffects: [
            (state) => state.resources -= 1500
        ],
        problems: [
            
        ]
    },
    'white-hole': {
        id: 'white-hole',
        name: 'White Hole',
        description: 'Создание чревоточины, что позволит нам перемещаться между планетами',
        icon: '🌌',
        progress: 0,
        speed: 0.11,
        effects: [
            (state) => state.cosmicCivilization.FTL = true
        ],
        failEffects: [
            (state) => state.resources -= 1500
        ],
        problems: [
            (state) => {
                state.problems.push({
                    id: 'collapse',
                    projectId: 'white-hole'
                });
            }
        ]
    },
    'big-fold': {
        id: 'big-fold',
        name: 'Big Fold',
        description: 'Сворачивание пространства от нас прямо к врагу!',
        icon: '🌌', 
        progress: 0,
        speed: 0.11,
        effects: [
            (state) => state.cosmicCivilization.FTL = true
        ],
        failEffects: [
            (state) => state.resources -= 1500
        ],
        problems: [
            (state) => {
                state.problems.push({
                    id: 'big-collapse',
                    projectId: 'big-fold'
                });
            }
        ]
    },
    'obsidian-portal': {
        id: 'obsidian-portal',
        name: 'Obsidian Portal',
        description: 'Создание портала, что позволит нам перемещаться между планетами',
        icon: '🌌',
        progress: 0,
        speed: 0.11,
        effects: [
            (state) => state.cosmicCivilization.FTL = true,
            (state) => state.cosmicCivilization.conquest = true,
            (state) => state.activeEvents.push({
                id: 'gold-bar',
                position: [0,0]
            })
        ],
        failEffects: [
            (state) => state.resources -= 1500
        ],
        problems: [
            (state) => {
                state.problems.push({
                    id: 'cripper',
                    projectId: 'obsidian-portal'
                });
            }
        ]
    }
};
