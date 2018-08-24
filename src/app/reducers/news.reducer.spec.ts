import { reducer, initialState, State } from './news.reducer';
import * as NewsActions from '../actions/news.actions';
import { ArticlePayload } from '../models/article-payload.model';
import { Service } from '../enums/service.enum';
import { Category } from '../enums/category.enum';
import { getArticles as MockData } from '../../testing/mock.newservice.getArticle.response';
import { Article } from '../models/article.model';
import { NewsCategory as NewsCategoryModel} from '../models/news-category.model';

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
    let category: Category;
    let service: Service;
    let payload: ArticlePayload;
    beforeEach(() => {
      articles = MockData() as Article[];
      const defaultValue: NewsCategoryModel = {
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
      category = Category.Health;

    });

    it('"AddInitialArticles" should add articles to state', () => {
      service = Service.NewsAPI;
      payload = { service, category, articles };
      testState[category] = {
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
      payload = { service, category, articles };
      testState[category] = {
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
      payload = { service, category, articles };
      testState[category] = {
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
