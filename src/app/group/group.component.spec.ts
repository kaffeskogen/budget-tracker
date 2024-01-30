import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupComponent } from './group.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { TransactionsService } from '../shared/data-access/transactions.service';
import { TransactionGroupsService } from '../shared/data-access/transaction-groups.service';

describe('GroupComponent', () => {
  let component: GroupComponent;
  let fixture: ComponentFixture<GroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupComponent],
      providers: [
        {
          provide: TransactionsService,
          useValue: {
            transactions: () => [
              {id: '1', title: 'Test', value: 100, icon: 'test', groupId: 'income'},
              {id: '2', title: 'Test 2', value: 100, icon: 'test', groupId: 'income'},
              {id: '3', title: 'Test 2', value: 100, icon: 'test', groupId: 'expense'}
            ]
          }
        },
        {
          provide: TransactionGroupsService,
          useValue: {
            groups: () => [{id: 'income', name: 'Income', color: 'blue'}]
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({groupId: 'income'})
          }
        }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should display name 'Income'`, () => {
    const groupName = fixture.nativeElement.querySelector('[data-qa="group-name"]');
    expect(groupName.textContent).toContain('Income');
  });

  it(`should display 2 transactions`, () => {
    const transactions = fixture.nativeElement.querySelectorAll('[data-qa="transaction-item"]');
    expect(transactions.length).toBe(2);
  });
});
