import { Group } from "../interfaces/Group";
import * as colors from 'tailwindcss/colors';

export const MOCK_GROUPS: Group[] = [
    {
        id: 'income',
        name: '🫰 Income',
        color: colors.green['700']
    },
    {
        id: 'planned',
        name: '⌚ Planned',
        color: colors.sky['700']
    },
    {
        id: 'savings',
        name: '💰 Savings',
        color: colors.red['700']
    },
    {
        id: 'food',
        name: '🍕 Food',
        color: colors.blue['700']
    },
    {
        id: 'other',
        name: '💸 Other',
        color: colors.yellow['700']
    }
];