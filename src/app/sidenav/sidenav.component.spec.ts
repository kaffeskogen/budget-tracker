import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidenavComponent } from './sidenav.component';
import { TransactionGroupsService } from '../shared/data-access/transaction-groups.service';
import { MOCK_GROUPS } from '../shared/mocks/groups';
import { By } from '@angular/platform-browser';

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
            groups: jasmine.createSpy().and.returnValue(MOCK_GROUPS),
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
    expect(links.length).toBe(MOCK_GROUPS.length);
  });
  
});
