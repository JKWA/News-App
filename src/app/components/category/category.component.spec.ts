import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CategoryComponent } from './category.component';
import { StoreModule } from '@ngrx/store';
import * as fromCategory from './../../reducers';
import { SharedModule } from './../../shared/shared.module';
import {
  MatIconModule,
  MatSlideToggle, MatSlideToggleModule,
  } from '@angular/material';


describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryComponent ],
      imports: [
        MatIconModule,
        MatSlideToggleModule,
        SharedModule,
        StoreModule.forRoot({...fromCategory.reducers}),
      ],
      providers: []
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));


  it('should create category component', () => {
    expect(component).toBeTruthy();
  });

  describe('HTML', () => {
    it('expect each toggle should call onClick method', () => {
      const componentDebug = fixture.debugElement;
      spyOn(component, 'onClick');
      const allToggles = componentDebug.queryAll(By.directive(MatSlideToggle));
      allToggles.map(toggle => {
        toggle.triggerEventHandler('change', null);
        expect(component.onClick).toHaveBeenCalled();
      });
    });
  });

});
