import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { tap, take } from 'rxjs/operators';
import { NewsComponent } from './news.component';
import { ArticleComponent } from '../article/article.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { CategoryState } from '../state/category.state';
// import { FilterState } from '../state/filter.state';
import { StoreModule } from '@ngrx/store';
import * as fromNews from './../../reducers';
import {
  MatIconModule,
  MatCardModule,
  MatTabGroup, MatTabsModule,
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
        StoreModule.forRoot({...fromNews.reducers}),
        ScrollEventModule
      ],
      providers: []
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    localStorage.clear();
  }));


  it('should create news component', () => {
    expect(component).toBeTruthy();
  });

  describe('HTML', () => {
    it('expect tab index change should call tabChanged method', () => {
      const componentDebug = fixture.debugElement;
      spyOn(component, 'tabChanged');
      const tabGroup = componentDebug.query(By.directive(MatTabGroup));
        tabGroup.triggerEventHandler('selectedIndexChange', 1);
        expect(component.tabChanged).toHaveBeenCalled();
    });

    it('expect tab group index selected to be 0',  () => {
      const componentDebug = fixture.debugElement;
      const tabGroup = componentDebug.query(By.directive(MatTabGroup));
      fixture.whenStable().then(() => {
        expect( tabGroup.attributes['ng-reflect-selected-index'] ).toEqual('0');
      });
    });

    it('expect general articles to be displayed', () => {
      const componentDebug = fixture.debugElement;
      const article = componentDebug.query(By.directive(ArticleComponent));
      expect( article.attributes['ng-reflect-category'] ).toEqual('general');
    });
  });

  describe('Defaults', () => {

    it('expect tab index to be 0', () => {
      component.selectedIndex.pipe(
        take(1),
        tap (index => {
          expect(index).toEqual(0);
        })
      ).subscribe();
    });

    it('expect 3 categories to be displayed', () => {
      component.getSelectedCategories.pipe(
        take(1),
        tap(categories => {
          expect(categories.length).toEqual(3);
        })
      ).subscribe();
    });

    it('expect general category to be selected', () => {
      component.getViewingCategory.pipe(
        take(1),
        tap(category => {
          expect(category).toBe('general');
        })
      ).subscribe();
    });
  });
});

  // save for possible e2e
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

