import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSettingsComponent } from './group-settings.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

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
});
