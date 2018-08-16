import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { tap } from 'rxjs/operators';
import { CategoryComponent } from './category.component';
import { CategoryState } from '../state/category.state';
  // import * as NgStore from '@ngxs/store';
  // import { NgxsModule } from '@ngxs/store';
import {
  MatIconModule,
  MatSlideToggle, MatSlideToggleModule,
  } from '@angular/material';

  import { StoreModule } from '@ngrx/store';
  import * as fromCategory from './../reducers';




describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryComponent ],
      imports: [
        MatIconModule,
        MatSlideToggleModule,
        StoreModule.forRoot({
          ...fromCategory.reducers
        }),
      ],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create category component', () => {
    expect(component).toBeTruthy();
  });

  it('expect 7 categories with 3 selected by default state', () => {
    component.getAllCategories.pipe(
      tap (categories => {
        expect(categories.size).toEqual(7);
        const selectedCategories = Array.from(categories).filter(category => category.selected);
        expect(selectedCategories.length).toEqual(3);
      })
    ).subscribe();
  });

  it('expect three toggles are checked by default state', () => {
    const componentDebug = fixture.debugElement;
    const allToggles = componentDebug.queryAll(By.directive(MatSlideToggle));
    const checkedToggles = allToggles.filter(toggle => toggle.attributes['ng-reflect-checked'] === 'true');
    expect(checkedToggles.length).toEqual(3);
  });


  it('each toggle should call onClick method', () => {
    const componentDebug = fixture.debugElement;
    spyOn(component, 'onClick');
    const allToggles = componentDebug.queryAll(By.directive(MatSlideToggle));
    allToggles.map(toggle => {
      toggle.triggerEventHandler('change', null);
      expect(component.onClick).toHaveBeenCalled();
    });
  });

});
