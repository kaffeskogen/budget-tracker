import { Group } from "../interfaces/Group";

export const MOCK_GROUPS: Group[] = [
    {
        id: 'income',
        name: '🫰 Income',
        color: '#4d7c0f' // colors.green['700']
    },
    {
        id: 'planned',
        name: '⌚ Planned',
        color: '#0369a1' // colors.sky['700']
    },
    {
        id: 'savings',
        name: '💰 Savings',
        color: '#b91c1c' // colors.red['700']
    },
    {
        id: 'food',
        name: '🍕 Food',
        color: '#1d4ed8' // colors.blue['700']
    },
    {
        id: 'other',
        name: '💸 Other',
        color: '#a16207' // colors.yellow['700']
    }
];