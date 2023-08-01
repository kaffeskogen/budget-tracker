import { Transaction } from "../interfaces/Transaction";

const transactions: Transaction[] = [
    {
        icon: 'CurrencyEuro',
        value: 50_000,
        groupId: 'income',
        title: 'Salary husband',
        category: 'Wage',
        date: new Date('2022-01-07'),
        recurring: true
    },
    {
        icon: 'CurrencyEuro',
        value: 50_000,
        title: 'Salary wife',
        category: 'Wage',
        groupId: 'income',
        date: new Date('2022-01-09'),
        recurring: true
    },
    {
        icon: 'CheckBadge',
        value: 1250,
        title: 'Child benefit',
        category: 'Allowance',
        groupId: 'income',
        date: new Date('2022-01-12'),
        recurring: true
    },
    {
        icon: 'CheckBadge',
        value: 3442,
        title: 'Childcare (Wife)',
        category: 'Allowance',
        groupId: 'income',
        date: new Date('2022-01-12'),
        recurring: true
    },
    {
        icon: 'BuildingStorefront',
        value: -50.0,
        title: 'Grocery shopping',
        category: 'Food',
        groupId: 'food',
        date: new Date('2022-01-07')
    },
    {
        icon: 'BuildingLibrary',
        value: -15.5,
        title: 'Laundry detergent',
        category: 'Household Supplies',
        groupId: 'food',
        date: new Date('2022-01-09')
    },
    {
        icon: 'EllipsisHorizontalCircle',
        value: -100.0,
        estimation: 120.0,
        title: 'Oil change',
        category: 'Transportation',
        groupId: 'planned',
        date: new Date('2022-01-12')
    },
    {
        icon: 'Heart',
        value: -20.0,
        title: 'Coffee with friends',
        category: 'Entertainment',
        groupId: 'other',
        date: new Date('2022-01-15')
    },
    {
        icon: 'Inbox',
        value: -150.0,
        title: 'New shoes',
        category: 'Shopping',
        groupId: 'other',
        date: new Date('2022-01-18')
    }
];

export const MOCK_TRANSACTIONS = transactions as Transaction[];