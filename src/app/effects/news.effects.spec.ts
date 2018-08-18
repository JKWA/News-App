import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SpyLocation } from '@angular/common/testing';
import { Location } from '@angular/common';
import { provideMockActions } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { cold, hot, getTestScheduler } from 'jasmine-marbles';
import { Observable, empty, of, defer } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { StoreModule } from '@ngrx/store';
import * as fromNews from './../reducers';


import { Category } from '../enums/category.enum';
import * as NewsActions from '../actions/news.actions';
import { NewsActionTypes } from '../actions/news.actions';
import { getArticles as MockData } from '../../testing/mock.newservice.getArticle.response';
import { Service } from '../enums/service.enum';

import { NewsEffects, SCHEDULER, DEBOUNCE } from './news.effects';
import { NewsDataService } from './../service/news-data.service';
import { LocalDbService } from './../service/local-db.service';
import { Article } from '../models/article.model';
// import {NewsDataService} from './../service/news-data.service';


export class TestActions extends Actions {
  constructor() {
    super(empty());
  }

  set stream(source: Observable<any>) {
    this.source = source;
  }
}

export function getActions() {
  return new TestActions();
}

class MockNewsDataService {
  getNews = jasmine.createSpy('getNews');
}

class MockLocalDbService {
  setNews = jasmine.createSpy('setNews');
  getNews = jasmine.createSpy('getNews');
  getExpiredData = jasmine.createSpy('getExpiredData');
  removeArticle = jasmine.createSpy('removeArticle');
}

describe('NewsEffects', () => {
  let actions$: TestActions;
  let effects: NewsEffects;
  let newsDataService: MockNewsDataService;
  let localDbService: MockLocalDbService;
  let location: SpyLocation;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NewsEffects,
        provideMockActions(() => actions$),
        { provide: NewsDataService, useClass: MockNewsDataService },
        { provide: LocalDbService, useClass: MockLocalDbService },
        { provide: Actions, useFactory: getActions },
        // { provide: DEBOUNCE, useValue: 30 },
        // { provide: SCHEDULER, useFactory: getTestScheduler }
      ],
      imports: [
        StoreModule.forRoot({...fromNews.reducers}),
        RouterTestingModule
      ]
    });

    effects = TestBed.get(NewsEffects);
    newsDataService = TestBed.get(NewsDataService);
    localDbService = TestBed.get(LocalDbService);
    actions$ = TestBed.get(Actions);
    location = TestBed.get(Location);
  });

  describe('initialApiNews$', () => {
    it('should return an AddInitialArticles, with articles, on success', () => {

      const filters = new Set(['trump', 'sanders']);
      const category = Category.Science;
      const pageNumber = 1;
      const articles = MockData();
      const service = Service.NewsAPI;

      const action = new NewsActions.InitiateNews(category);
      const articlePayload: NewsActions.ArticlePayload = {category, articles, service};
      const completion = new NewsActions.AddInitialArticles(articlePayload);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-b|', { b: articles });
      const expected = cold('--c', { c: completion });
      newsDataService.getNews.and.returnValue(response);
      expect(effects.initialApiNews$).toBeObservable(expected);
    });
  });

  // describe('getClientNewsData$', () => {
  //   it('should return a AddInitialArticles, with articles, on success', () => {

  //     const category = Category.General;
  //     const articles: any = MockData().slice(0).map(article => {
  //       // article.timestamp = new Date().toISOString();
  //       // article.category = category;
  //       return article;
  //     });

  //     const service = Service.IndexedDb;

  //     const action = new NewsActions.InitiateNews(category);
  //     const articlePayload: NewsActions.ArticlePayload = {category, articles, service};
  //     const completion = new NewsActions.AddInitialClientArticles(articlePayload);

  //     actions$.stream = hot('-a', { a: action });
  //     const response = cold('-b|', { b: articles });
  //     const expected = cold('--c', { c: completion });
  //     localDbService.getNews.and.returnValue(response);
  //     // expect(effects.getClientNewsData$).toBeObservable(expected);
  //   });
  // });
});
