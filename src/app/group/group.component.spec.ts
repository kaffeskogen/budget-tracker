import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupComponent } from './group.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('GroupComponent', () => {
  let component: GroupComponent;
  let fixture: ComponentFixture<GroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupComponent],
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
    
    fixture = TestBed.createComponent(GroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
