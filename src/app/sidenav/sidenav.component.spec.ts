import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidenavComponent } from './sidenav.component';
import { TransactionGroupsService } from '../shared/data-access/transaction-groups.service';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;
  let transactionGroupsService: TransactionGroupsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidenavComponent],
      providers: [
        {
          provide: TransactionGroupsService,
          useValue: {
            groups: jasmine.createSpy().and.returnValue([
              {
                id: '1',
                name: 'Group 1',
                icon: 'icon 1',
              },
              {
                id: '2',
                name: 'Group 2',
                icon: 'icon 2',
              },
              {
                id: '3',
                name: 'Group 3',
                icon: 'icon 3',
              },
            ]),
            add$: {
              next: jasmine.createSpy(),
            },
            remove$: {
              next: jasmine.createSpy(),
            },
            edit$: {
              next: jasmine.createSpy(),
            },
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of ({groupId: 'income'})
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    transactionGroupsService = TestBed.inject(TransactionGroupsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if there are links equal to MOCK_GROUPS', () => {
    fixture.detectChanges();
    const links = fixture.debugElement.queryAll(By.css('[data-qa="link"]'));
    expect(links.length).toBe(3);
  });
  
});
