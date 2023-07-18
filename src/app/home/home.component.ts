import { Component } from '@angular/core';
import { Transaction } from '../shared/interfaces/data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  incomes: Transaction[] = [
    {
      value: 50_000,
      title: 'Salary Husband',
      category: 'Wage',
      currency: 'SEK',
      date: new Date('2022-01-07'),
      recurring: true
    },
    {
      value: 50_000,
      title: 'Salary wife',
      category: 'Wage',
      currency: 'SEK',
      date: new Date('2022-01-09'),
      recurring: true
    },
    {
      value: 1250,
      title: 'Child benefit',
      category: 'Allowance',
      currency: 'SEK',
      date: new Date('2022-01-12'),
      recurring: true
    }
  ];

  expenses: Transaction[] = [
    {
      value: -50.0,
      title: 'Grocery shopping',
      category: 'Food',
      currency: 'SEK',
      date: new Date('2022-01-07')
    },
    {
      value: -15.5,
      title: 'Laundry detergent',
      category: 'Household Supplies',
      currency: 'SEK',
      date: new Date('2022-01-09')
    },
    {
      value: -100.0,
      title: 'Oil change',
      category: 'Transportation',
      currency: 'SEK',
      date: new Date('2022-01-12')
    },
    {
      value: -20.0,
      title: 'Coffee with friends',
      category: 'Entertainment',
      currency: 'SEK',
      date: new Date('2022-01-15')
    },
    {
      value: -150.0,
      title: 'New shoes',
      category: 'Shopping',
      currency: 'SEK',
      date: new Date('2022-01-18')
    }
  ];


}
