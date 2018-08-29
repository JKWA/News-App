import { reducer, initialState, State } from './news.reducer';
import * as NewsActions from '../actions/news.actions';
import { ArticlePayload } from '../models/article-payload.model';
import { Service } from '../enums/service.enum';
import { NewsSection } from '../enums/news-section.enum';
import { getArticles as MockData } from '../../testing/mock.newservice.getArticle.response';
import { Article } from '../models/article.model';
import { NewsDataModel} from '../models/news-data.model';

describe('News Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
  describe('News actions - add articles', () => {
    let articles: Article[];
    let testState: State;
    let newsSection: NewsSection;
    let service: Service;
    let payload: ArticlePayload;
    beforeEach(() => {
      articles = MockData() as Article[];
      const defaultValue: NewsDataModel = {
        retrieving: false,
        page: 1,
        firstLoadComplete: false,
        clientDataLoaded: false,
        articles: []
      };
      testState = {
        business: Object.assign({}, defaultValue),
        entertainment: Object.assign({}, defaultValue),
        general: Object.assign({}, defaultValue),
        health: Object.assign({}, defaultValue),
        science: Object.assign({}, defaultValue),
        sports: Object.assign({}, defaultValue),
        technology: Object.assign({}, defaultValue),
      };
      newsSection = NewsSection.Health;

    });

    it('"AddInitialArticles" should add articles to state', () => {
      service = Service.NewsAPI;
      payload = { service, newsSection, articles };
      testState[newsSection] = {
          retrieving: false,
          page: 2,
          firstLoadComplete: true,
          clientDataLoaded: false,
          articles: articles
        };
      const action = new NewsActions.AddInitialApiArticles(payload);
      const result = reducer(initialState, action);
      expect(result).toEqual(testState);
    });

    it('"AddInitialClientArticles" should add articles to state', () => {
      service = Service.IndexedDb;
      payload = { service, newsSection, articles };
      testState[newsSection] = {
          retrieving: false,
          page: 1,
          firstLoadComplete: true,
          clientDataLoaded: true,
          articles: articles
        };
      const action = new NewsActions.AddInitialClientArticles(payload);
      const result = reducer(initialState, action);
      expect(result).toEqual(testState);
    });

    it('"InsertAdditionalNewsFromApi" should add articles to state', () => {
      service = Service.IndexedDb;
      payload = { service, newsSection, articles };
      testState[newsSection] = {
          retrieving: false,
          page: 2,
          firstLoadComplete: true,
          clientDataLoaded: false,
          articles: articles
        };
      const action = new NewsActions.InsertAdditionalNewsFromApi(payload);
      const result = reducer(initialState, action);
      expect(result).toEqual(testState);
    });
  });
});
