import { GameState, Problem } from "./types";

export const Problems: Record<string, Problem> = {
    'religios-fanatics': {
        id: 'religios-fanatics',
        name: 'Религиозные фанатики',
        description: 'Религиозные фанатики недовольны вашим научным прогрессом',
        icon: '🔮',
        position: 'random',
        weight: 10,
        amount: 50,
        time: 1000 * 25
    },
    'libs': {
        id: 'libs',
        name: 'Либералы',
        description: 'Люди уверены что все ваши усилия направлены на контроль, а не на безопасность',
        icon: '🛂',
        position: 'random',
        weight: 10,
        amount: 50, 
        time: 1000 * 25
    },
    'antigun': {
        id: 'antigun',
        name: 'Противники оружия',
        description: 'Лобби против оружия, не хотят видеть огромную пушку, которую видно везде',
        icon: '🔫',
        position: 'random',
        weight: 3,
        amount: 50,
        time: 1000 * 25
    },
    'gravitation': {
        id: 'gravitation',
        name: 'Гравитация',
        description: 'Сфера начала рушится под своим весом',
        icon: '💥',
        position: 'random',
        weight: 10,
        amount: 200,
        time: 1000 * 250
    },
    'capitalists': {
        id: 'capitalists',
        name: 'Капиталисты',
        description: 'Людей не устраивает проект, деньги можно потратить выгоднее',
        icon: '💰',
        position: 'random',
        weight: 10,
        amount: 200,
        time: 1000 * 250
    },
    'rationalists': {
        id: 'rationalists',
        name: 'Рационалисты',
        description: 'Что за чушь? Это невозможно!',
        icon: '🤡',
        position: 'random',
        weight: 10,
        amount: 200,
        time: 1000 * 250
    },
    'spice-explosion': {
        id: 'spice-explosion',
        name: 'Взрыв странного вещества',
        description: 'Странное вещество взорвалось',
        icon: '💥',
        position: 'random',
        weight: 10,
        amount: 50,
        time: 1000 * 60
    },
    'spice-empty': {
        id: 'spice-empty',
        name: 'Пустота',
        description: 'Странное вещество это пустышка!',
        icon: '💥',
        position: 'random',
        weight: 10,
        amount: 20,
        time: 1000 * 60
    },
    'cripper': {
        id: 'cripper',
        name: 'Криппер',
        description: 'Что он тут делает?',
        icon: '💥', 
        position: 'random',
        weight: 10,
        amount: 200,
        time: 1000 * 400
    },
    'collapse': {
        id: 'collapse',
        name: 'Схлопывание',
        description: 'Ваш проект схлопывается под своим весом!',
        icon: '💥',
        position: 'random',
        weight: 10,
        amount: 200,
        time: 1000 * 400
    },
    'big-collapse': {
        id: 'big-collapse',
        name: 'Схлопывание',
        description: 'Ваш проект схлопывается под своим весом!',
        icon: '💥',
        position: 'random',
        weight: 80,
        amount: 20,
        time: 1000 * 20
    }
};
