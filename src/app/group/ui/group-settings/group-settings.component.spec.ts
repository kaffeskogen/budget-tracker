import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSettingsComponent } from './group-settings.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { TransactionGroupsService } from 'src/app/shared/data-access/transaction-groups.service';

describe('GroupSettingsComponent', () => {
  let component: GroupSettingsComponent;
  let fixture: ComponentFixture<GroupSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupSettingsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({groupId: 'income'})
          }
        },
        {
          provide: TransactionGroupsService,
          useValue: {
            group: (name: string) => () => ({id: 'income', name: 'Income', color: 'blue'}),
            $edit: () => undefined
          }
        }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should set default value of group name to 'Income'`, () => {
    expect(component.form()?.controls[0].defaultValue).toBe('Income');
  });

  it('should rename group', () => {
    const service = TestBed.inject(TransactionGroupsService);
    const spy = spyOn(service.edit$, 'next');
    component.onSave({name: 'New name'});
    expect(spy).toHaveBeenCalledWith({id: 'income', name: 'New name', color: 'blue'} as any);
  });
});
