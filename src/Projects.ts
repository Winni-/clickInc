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
        progress: 0.1,
        speed: 1,
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
        progress: 0.01,
        speed: 1,
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
        progress: 0.5,
        speed: 1,
        effects: [
            (state) => state.multipliers[SCIENCE] += 0.20,
            (state) => state.secondStage.push('dyson-swarm')
        ],
        failEffects: [
            (state) => state.resources -= 1000
        ]
    },
    'dyson-sphere': {
        id: 'dyson-sphere',
        name: 'Dyson Sphere',
        description: 'Создать сферу из спутников, вокруг Солнца.',
        icon: '🛰',
        progress: 0.5,
        speed: 1,
        effects: [
            (state) => state.multipliers[SCIENCE] += 0.50,
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
        progress: 0.1,
        speed: 1,
        effects: [
            (state) => {
                const artefacts = ['nanotubes', 'quantum-threads', 'dark-matter', 'negative-mass-matter'];
                const randomArtefact = artefacts[Math.floor(Math.random() * artefacts.length)];
                state.secondStage.push(randomArtefact);
            },
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
        progress: 0.1,
        speed: 1,
        effects: [
            (state) => {
                if (Math.random() < 0.5) {
                    state.secondStage.push('contact')
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
    }
};
