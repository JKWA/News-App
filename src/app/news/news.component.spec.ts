import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { tap, take } from 'rxjs/operators';
import { NewsComponent } from './news.component';
import { ArticleComponent } from '../article/article.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CategoryState } from '../state/category.state';
import { FilterState } from '../state/filter.state';
import * as NgStore from '@ngxs/store';
import { NgxsModule } from '@ngxs/store';
import {
  MatIconModule,
  MatCardModule,
  MatTabGroup, MatTab, MatTabsModule,
  MatProgressSpinnerModule,
  } from '@angular/material';
import { ScrollEventModule } from 'ngx-scroll-event';


describe('NewsComponent', () => {
  let component: NewsComponent;
  let fixture: ComponentFixture<NewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsComponent, ArticleComponent ],
      imports: [
        BrowserAnimationsModule,
        MatIconModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatTabsModule,
        NgxsModule.forRoot([ CategoryState, FilterState ]),
        ScrollEventModule
      ],
      providers: [
        NgStore.Store, NgStore.StateStream, NgStore.ɵo,
        NgStore.ɵm, NgStore.ɵg, NgStore.ɵl, NgStore.ɵp, NgStore.ɵj
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    localStorage.clear();
  });

  it('should create news component', () => {
    expect(component).toBeTruthy();
  });

  it('should create tab group component', () => {
    const componentDebug = fixture.debugElement;
    const tabGroup = componentDebug.query(By.directive(MatTabGroup));
    fixture.whenStable()
    .then(() => {
      console.log(tabGroup);
      // expect( tabGroup ).toBeTruthy();
    });
  });

  it('expect tab index to be 0 by defualt state', () => {
    component.selectedIndex.pipe(
      take(1),
      tap (index => {
        expect(index).toEqual(0);
      })
    ).subscribe();
  });

  it('expect tab group index selected to be 0 by default state',  () => {
    const componentDebug = fixture.debugElement;
    const tabGroup = componentDebug.query(By.directive(MatTabGroup));
    fixture.whenStable().then(() => {
      console.log(tabGroup.attributes['ng-reflect-selected-index']);
      // expect( tabGroup.attributes['ng-reflect-selected-index'] ).toEqual('0');
    });
  });

  it('expect 3 categories to be displayed by default state', () => {
    component.categories.pipe(
      take(1),
      tap(categories => {
        expect(categories.size).toEqual(3);
      })
    ).subscribe();
  });

  it('expect general category to be selected by default state', () => {
    component.setCategory.pipe(
      take(1),
      tap(category => {
        expect(category.id).toBe('general');
      })
    ).subscribe();
  });

  // it('expect general articles to be displayed by defualt state', () => {
  //   const componentDebug = fixture.debugElement;
  //   const article = componentDebug.query(By.directive(ArticleComponent));
  //   expect( article.attributes['ng-reflect-category'] ).toEqual('general');
  // });

  it('tab index change should call tabChanged method', () => {
    const componentDebug = fixture.debugElement;
    spyOn(component, 'tabChanged');
    const tabGroup = componentDebug.query(By.directive(MatTabGroup));
      tabGroup.triggerEventHandler('selectedIndexChange', 1);
      expect(component.tabChanged).toHaveBeenCalled();
  });


  // it('change group updates local cache', () => {
  //   const componentDebug = fixture.debugElement;
  //   const tabGroup = componentDebug.query(By.directive(MatTabGroup));

  //   expect( tabGroup.attributes['ng-reflect-selected-index'] ).toBe('0');
  //   tabGroup.triggerEventHandler('selectedIndexChange', 1);

  //   fixture.detectChanges();
  //   fixture.whenStable().then(() => {
  //     expect( tabGroup.attributes['ng-reflect-selected-index'] ).toBe('1');
  //     expect( localStorage.getItem('setCategory') ).toBe('science');
  //     // delete local storage when done
  //     localStorage.clear();
  //   });
  //   // localStorage.clear();
  // });

  // localStorage.clear();
});
