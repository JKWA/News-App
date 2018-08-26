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
import { Time } from '../shared/utility/time.utility';
import * as ServiceMessage from '../messages/service.messages';
import { ArticlePayload } from '../models/article-payload.model';


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
  setData = jasmine.createSpy('setData');
  getData = jasmine.createSpy('getData');
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

    it('"InitiateNews" should return an AddInitialApiArticles, with articles, on success', () => {
      const category = Category.Science;
      const articles = MockData() as Article[];
      const service = Service.NewsAPI;
      const action = new NewsActions.InitiateNews(category);
      const articlePayload: ArticlePayload = {category, articles, service};
      const completion = new NewsActions.AddInitialApiArticles(articlePayload);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-b|', { b: articlePayload });
      const expected = cold('--c', { c: completion });
      newsDataService.getNews.and.returnValue(response);
      expect(effects.getInitialApiNews$).toBeObservable(expected);
    });

    it('"InitiateNews" should return an AddInitialApiArticlesFailed, with message, on fail', () => {
      const category = Category.Science;
      const articles = [] as Article[];
      const service = Service.NewsAPI;
      const action = new NewsActions.InitiateNews(category);
      const articlePayload = {category, service};
      const completion = new NewsActions.AddInitialApiArticlesFailed(new ServiceMessage.NewsApiMessage().errorMessage);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-#|', { b: articlePayload });
      const expected = cold('--c', { c: completion });
      newsDataService.getNews.and.returnValue(response);
      expect(effects.getInitialApiNews$).toBeObservable(expected);
    });

    it('"AddInitialApiArticles" should return an GetExpiredData, with list if keys, on success', () => {
      const category = Category.Sports;
      const service = Service.NewsAPI;
      let key = 0;
      const articles = MockData().map(article => {
        article.timestamp = new Time().sixtyMinutesAgo;
        article.key = key++;
        article.category = category;
        return article;
      }) as SavedArticle[];

      const articlePayload: ArticlePayload = {category, articles, service};
      const action = new NewsActions.AddInitialApiArticles(articlePayload);
      const completion = new NewsActions.GetExpiredData(articles.map(article => article.key));

      actions$.stream = hot('-a', { a: action });
      const response = cold('-b|', { b: articles.map(article => article.key) });
      const expected = cold('--c', { c: completion });
      indexDbService.getExpiredData.and.returnValue(response);
      expect(effects.getExpiredData$).toBeObservable(expected);
    });

    it('"AddInitialApiArticles" should return an GetExpiredDataFailed, with list if keys, on failure', () => {
      const category = Category.Sports;
      const service = Service.NewsAPI;
      let key = 0;

      const articles = MockData().map(article => {
        article.timestamp = new Time().sixtyMinutesAgo;
        article.key = key++;
        article.category = category;
        return article;
      }) as SavedArticle[];

      const articlePayload: ArticlePayload = {category, articles, service};
      const action = new NewsActions.AddInitialApiArticles(articlePayload);
      const completion = new NewsActions.GetExpiredDataFailed(new ServiceMessage.GetExpiredArticlesMessage().errorMessage);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-#|', { b: null});
      const expected = cold('--c', { c: completion });
      indexDbService.getExpiredData.and.returnValue(response);
      expect(effects.getExpiredData$).toBeObservable(expected);
    });

    it('"AddInitialApiArticles" should return an SaveArticlesToClient, with message, on success', () => {
      const category = Category.Sports;
      const service = Service.IndexedDb;
      const articles = MockData() as Article[];

      const articlePayload: ArticlePayload = {category, articles, service};
      const action = new NewsActions.AddInitialApiArticles(articlePayload);
      const completion = new NewsActions.SaveArticlesToClient(new ServiceMessage.SavedIndexedDbMessage().successMessage);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-b|', { b: new ServiceMessage.SavedIndexedDbMessage().successMessage});
      const expected = cold('--c', { c: completion });
      indexDbService.setData.and.returnValue(response);
      expect(effects.saveApiNewsToIndexedDB$).toBeObservable(expected);
    });

    it('"AddInitialApiArticles" should return an SaveArticlesToClientFailed, with message, on failure', () => {
      const category = Category.Sports;
      const service = Service.IndexedDb;
      const articles = MockData() as Article[];

      const articlePayload: ArticlePayload = {category, articles, service};
      const action = new NewsActions.AddInitialApiArticles(articlePayload);
      const completion = new NewsActions.SaveArticlesToClientFailed(new ServiceMessage.SavedIndexedDbMessage().errorMessage);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-#|', { b: new ServiceMessage.SavedIndexedDbMessage().errorMessage});
      const expected = cold('--c', { c: completion });
      indexDbService.setData.and.returnValue(response);
      expect(effects.saveApiNewsToIndexedDB$).toBeObservable(expected);
    });

    it('"InitiateNews" should return an AddInitialClientArticles, with list if keys, on success', () => {
      const category = Category.Sports;
      const service = Service.IndexedDb;
      const articles = MockData() as Article[];

      const articlePayload: ArticlePayload = {category, articles, service};
      const action = new NewsActions.InitiateNews(category);
      const completion = new NewsActions.AddInitialClientArticles(articlePayload);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-b|', { b: articles});
      const expected = cold('--c', { c: completion });
      indexDbService.getData.and.returnValue(response);
      expect(effects.getInitialClientNews$).toBeObservable(expected);
    });

    it('"InitiateNews" should return an AddInitialClientArticlesFailed, with message, on error', () => {
      const category = Category.Sports;
      const action = new NewsActions.InitiateNews(category);
      const completion = new NewsActions.AddInitialClientArticlesFailed(new ServiceMessage.SavedIndexedDbMessage().errorMessage);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-#|', { b: null});
      const expected = cold('--c', { c: completion });
      indexDbService.getData.and.returnValue(response);
      expect(effects.getInitialClientNews$).toBeObservable(expected);
    });

    it('"GetAdditionalNewsFromApi" should return a InsertAdditionalNewsFromApi, after throttle, on success', () => {
      const category = Category.Sports;
      const service = Service.NewsAPI;
      const articles = MockData() as Article[];
      const articlePayload: ArticlePayload = {category, articles, service};
      const action = new NewsActions.GetAdditionalNewsFromApi(category);
      const completion = new NewsActions.InsertAdditionalNewsFromApi(articlePayload);

      actions$.stream = hot('-aaaaaaa', { a: action });
      const response = cold('-b|', { b: articlePayload });
      const expected = cold('--c---c', { c: completion });
      newsDataService.getNews.and.returnValue(response);

      expect(effects.getAddionalNews$).toBeObservable(expected);
    });

    // it('"GetAdditionalNewsFromApi" should return a InsertAdditionalNewsFromApiFailed, after throttle, on failure', () => {
    //   const category = Category.Sports;
    //   const service = Service.NewsAPI;
    //   const articles = MockData() as Article[];
    //   const articlePayload: ArticlePayload = {category, articles, service};
    //   const action = new NewsActions.GetAdditionalNewsFromApi(category);
    //   const completion = new NewsActions.InsertAdditionalNewsFromApiFailed(new ServiceMessage.NewsApiMessage().errorMessage);

    //   actions$.stream = hot('-aa', { a: action });
    //   const response = cold('-bb#|', { b: articlePayload });
    //   const expected = cold('--c', { c: completion });
    //   newsDataService.getNews.and.returnValue(response);

    //   expect(effects.search$).toBeObservable(expected);
    // });

  });
});
