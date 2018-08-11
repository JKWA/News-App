import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as NgStore from '@ngxs/store';
import { NgxsModule } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { OnlineState } from '../state/online.state';
import { CategoryState } from '../state/category.state';
import { FilterState } from '../state/filter.state';
import { NewsState } from '../state/news.state';
import { InMemoryDataService } from '../../testing/in-memory-data.service';


import {
  MatCardModule,
  MatIconModule,
  MatProgressSpinnerModule,
  } from '@angular/material';
  import { ScrollEventModule } from 'ngx-scroll-event';


import { ArticleComponent } from './article.component';

describe('ArticleComponent', () => {
  let component: ArticleComponent;
  let fixture: ComponentFixture<ArticleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleComponent ],
      imports: [
        HttpClientModule,
        ! environment.production
        ? HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService)
        : [],
        MatCardModule,
        MatIconModule,
        MatProgressSpinnerModule,
        ScrollEventModule,
        NgxsModule.forRoot([ CategoryState, FilterState, OnlineState, NewsState ]),
      ],
      providers: [
        NgStore.Store, NgStore.StateStream, NgStore.ɵo,
        NgStore.ɵm, NgStore.ɵg, NgStore.ɵl, NgStore.ɵp, NgStore.ɵj
       ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('article default data correct', () => {
    component.stateNews.pipe(
      tap(result => {
        const category = result[component.tabViewed.id];
        expect( category.articles.length ).toEqual(0);
        expect( category.clientDataLoaded ).toBeFalsy();
        expect( category.firstLoadComplete ).toBeFalsy();
        expect( category.page ).toEqual(1);
        expect( category.retrieving ).toBeFalsy();
      })
    )
    .subscribe();
  });
  it('article default filters correct', () => {
    component.filters.pipe(
      tap(result =>  expect( result ).toEqual(new Set ([ 'trump', 'sanders' ])))
    ).subscribe();
  });
});
