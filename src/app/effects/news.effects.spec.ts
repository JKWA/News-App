import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SpyLocation } from '@angular/common/testing';
import { Location } from '@angular/common';
import { Observable, empty} from 'rxjs';
import { StoreModule } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot, getTestScheduler } from 'jasmine-marbles';
import * as fromNews from './../reducers';
import { Category } from '../enums/category.enum';
import * as NewsActions from '../actions/news.actions';
import { getArticles as MockData } from '../../testing/mock.newservice.getArticle.response';
import { Service } from '../enums/service.enum';
import { NewsEffects, SCHEDULER, DEBOUNCE } from './news.effects';
import { Article, SavedArticle } from '../models/article.model';
import { NewsDataService } from './../services/news-data.service';
import { IndexedDbService } from '../services/indexed-db.service';
import { Time } from '../utility/time.utility';
import * as ServiceMessage from '../messages/service.messages';


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

class MockIndexedDbService {
  setNews = jasmine.createSpy('setNews');
  getNews = jasmine.createSpy('getNews');
  getExpiredData = jasmine.createSpy('getExpiredData');
  removeArticle = jasmine.createSpy('removeArticle');
}

describe('NewsEffects', () => {
  let actions$: TestActions;
  let effects: NewsEffects;
  let newsDataService: MockNewsDataService;
  let indexDbService: MockIndexedDbService;
  let location: SpyLocation;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NewsEffects,
        provideMockActions(() => actions$),
        { provide: NewsDataService, useClass: MockNewsDataService },
        { provide: IndexedDbService, useClass: MockIndexedDbService },
        { provide: Actions, useFactory: getActions },
        { provide: DEBOUNCE, useValue: 30 },
        { provide: SCHEDULER, useFactory: getTestScheduler }
      ],
      imports: [
        StoreModule.forRoot({...fromNews.reducers}),
        RouterTestingModule
      ]
    });

    effects = TestBed.get(NewsEffects);
    newsDataService = TestBed.get(NewsDataService);
    indexDbService = TestBed.get(IndexedDbService);
    actions$ = TestBed.get(Actions);
    location = TestBed.get(Location);
  });

  describe('get news process', () => {
    it('"InitiateNews" should return an AddInitialArticles, with articles, on success', () => {
      const category = Category.Science;
      const articles = MockData() as Article[];
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

    it('"InitiateNews" should return an NewsApiError, with message, on fail', () => {
      const category = Category.Science;
      const articles = [] as Article[];
      const service = Service.NewsAPI;
      const action = new NewsActions.InitiateNews(category);
      const articlePayload = {category, service};
      const completion = new NewsActions.NewsApiError(articlePayload);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-#|', { b: articles });
      const expected = cold('--c', { c: completion });
      newsDataService.getNews.and.returnValue(response);
      expect(effects.initialApiNews$).toBeObservable(expected);
    });

    it('"AddInitialArticles" should return an GetExpiredData, with list if keys, on success', () => {
      const category = Category.Sports;
      const service = Service.NewsAPI;
      let key = 0;
      const articles = MockData().map(article => {
        article.timestamp = new Time().sixtyMinutesAgo;
        article.key = key++;
        article.category = category;
        return article;
      }) as SavedArticle[];

      const articlePayload: NewsActions.ArticlePayload = {category, articles, service};
      const action = new NewsActions.AddInitialArticles(articlePayload);
      const completion = new NewsActions.GetExpiredData(articles.map(article => article.key));

      actions$.stream = hot('-a', { a: action });
      const response = cold('-b|', { b: articles.map(article => article.key) });
      const expected = cold('--c', { c: completion });
      indexDbService.getExpiredData.and.returnValue(response);
      expect(effects.getExpiredData$).toBeObservable(expected);
    });

    it('"AddInitialArticles" should return an GetExpiredDataFailed, with list if keys, on failure', () => {
      const category = Category.Sports;
      const service = Service.NewsAPI;
      let key = 0;

      const articles = MockData().map(article => {
        article.timestamp = new Time().sixtyMinutesAgo;
        article.key = key++;
        article.category = category;
        return article;
      }) as SavedArticle[];

      const articlePayload: NewsActions.ArticlePayload = {category, articles, service};
      const action = new NewsActions.AddInitialArticles(articlePayload);
      const completion = new NewsActions.GetExpiredDataFailed(new ServiceMessage.GetExpiredArticlesMessage().errorMessage);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-#|', { b: null});
      const expected = cold('--c', { c: completion });
      indexDbService.getExpiredData.and.returnValue(response);
      expect(effects.getExpiredData$).toBeObservable(expected);
    });
  });

it('"AddInitialArticles" should return an GetExpiredDataFailed, with list if keys, on failure', () => {
    const category = Category.Sports;
    const service = Service.NewsAPI;
    let key = 0;

    const articles = MockData().map(article => {
      article.timestamp = new Time().sixtyMinutesAgo;
      article.key = key++;
      article.category = category;
      return article;
    }) as SavedArticle[];

    const articlePayload: NewsActions.ArticlePayload = {category, articles, service};
    const action = new NewsActions.AddInitialArticles(articlePayload);
    const completion = new NewsActions.GetExpiredDataFailed(new ServiceMessage.GetExpiredArticlesMessage().errorMessage);

    actions$.stream = hot('-a', { a: action });
    const response = cold('-#|', { b: null});
    const expected = cold('--c', { c: completion });
    indexDbService.getExpiredData.and.returnValue(response);
    expect(effects.getExpiredData$).toBeObservable(expected);
  });
});

  // describe('saveNewsToIndexedDb$', () => {
  //   it('should return an AddInitialArticles, with articles, on success', () => {

  //     const articlePayload: NewsActions.ArticlePayload = {
  //       category: Category.Science,
  //       articles:  MockData(),
  //       service: Service.IndexedDb
  //     };
  //     const action = new NewsActions.SaveArticlesToClient(articlePayload);
  //     const completion = new NewsActions.IndexedDbSaved(Category.Science);

  //     const savedArticle = MockData().map(article => {
  //       article.timestamp = new Date().toISOString();
  //       article.category = Category.Science;
  //       return article;
  //     }) as SavedArticle[];

  //     actions$.stream = hot('-a', { a: action });
  //     const response = cold('-b|', { b: savedArticle });
  //     const expected = cold('--c', { c: completion });
  //     localDbService.setNews.and.returnValue(response);
  //     expect(effects.saveNewsToIndexedDb$).toBeObservable(expected);
  //   });
  // });

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
// });
