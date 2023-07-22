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
        id: 'Savings',
        name: 'savings',
        icon: '💰',
        color: colors.red['700']
    },
    {
        id: 'Food',
        name: 'food',
        icon: '🍕',
        color: colors.blue['700']
    },
    {
        id: 'Other',
        name: 'other',
        icon: '💸',
        color: colors.yellow['700']
    }
];