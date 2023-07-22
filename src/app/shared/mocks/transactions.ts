import { Transaction } from "../interfaces/Transaction";
import { MOCK_GROUPS } from "./groups";

const transactions: Transaction[] = [
    {
        value: 50_000,
        currency: 'SEK',
        groupId: 'income',
        title: 'Salary husband',
        category: 'Wage',
        date: new Date('2022-01-07'),
        recurring: true
    },
    {
        value: 50_000,
        title: 'Salary wife',
        category: 'Wage',
        currency: 'SEK',
        groupId: 'income',
        date: new Date('2022-01-09'),
        recurring: true
    },
    {
        value: 1250,
        title: 'Child benefit',
        category: 'Allowance',
        currency: 'SEK',
        groupId: 'income',
        date: new Date('2022-01-12'),
        recurring: true
    },
    {
        value: -50.0,
        title: 'Grocery shopping',
        category: 'Food',
        currency: 'SEK',
        groupId: 'food',
        date: new Date('2022-01-07')
    },
    {
        value: -15.5,
        title: 'Laundry detergent',
        category: 'Household Supplies',
        currency: 'SEK',
        groupId: 'food',
        date: new Date('2022-01-09')
    },
    {
        value: -100.0,
        estimation: 120.0,
        title: 'Oil change',
        category: 'Transportation',
        currency: 'SEK',
        groupId: 'planned',
        date: new Date('2022-01-12')
    },
    {
        value: -20.0,
        title: 'Coffee with friends',
        category: 'Entertainment',
        currency: 'SEK',
        groupId: 'other',
        date: new Date('2022-01-15')
    },
    {
        value: -150.0,
        title: 'New shoes',
        category: 'Shopping',
        currency: 'SEK',
        groupId: 'other',
        date: new Date('2022-01-18')
    }
];

export const MOCK_TRANSACTIONS = transactions as Transaction[];