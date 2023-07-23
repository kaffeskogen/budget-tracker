import { Group } from "../interfaces/Group";
import * as colors from 'tailwindcss/colors';

export const MOCK_GROUPS: Group[] = [
    {
        id: 'income',
        name: 'Income',
        icon: '🫰',
        color: colors.green['700']
    },
    {
        id: 'planned',
        name: 'Planned',
        icon: '⌚',
        color: colors.sky['700']
    },
    {
        id: 'savings',
        name: 'Savings',
        icon: '💰',
        color: colors.red['700']
    },
    {
        id: 'food',
        name: 'Food',
        icon: '🍕',
        color: colors.blue['700']
    },
    {
        id: 'other',
        name: 'Other',
        icon: '💸',
        color: colors.yellow['700']
    }
];