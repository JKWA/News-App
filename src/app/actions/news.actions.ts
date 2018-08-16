import { Action } from '@ngrx/store';
import { Category } from '../utility/category.enum';
import { Article } from '../models/article';
import { Error } from '../models/error';
import { Service } from '../models/service.enum';

export enum NewsActionTypes {
  LoadNews = '[News] Load Users',
  InitiateNews = '[App Component] Initiating news call',
  AddNews = '[Article Component] Adding news',
  RetrievingNews = '[Article Component] Retrieving initial news articles',
  AddInitialArticles = '[News Effects] Add initial news articles from API',
  AddInitialClientArticles = '[News Effects] Add initial news articles from client',
  SaveArticlesToClient = '[News Effects] save articles to client',
  IndexedDbError = '[News Effects] Indexed db error',
  IndexedDbSaved = '[News Effects] Saved articles to indexed db',
  NewsApiError = '[News Effects] News API error'


}

export class LoadNews implements Action {
  readonly type = NewsActionTypes.LoadNews;
}

export class InitiateNews implements Action {
  readonly type = NewsActionTypes.InitiateNews;
  constructor(public payload: Category) { }
}

export class AddNews implements Action {
  readonly type = NewsActionTypes.AddNews;
  constructor(public payload: any) { }
}

export class RetrievingNews implements Action {
  readonly type = NewsActionTypes.AddInitialArticles;
  constructor(public payload: any) { }
}

interface ArticlePayload {
  category: Category;
  articles: Article[];
  service: Service;
}

export class AddInitialArticles implements Action {
  readonly type = NewsActionTypes.AddInitialArticles;
  constructor(public payload: ArticlePayload) { }
}

export class NewsApiError implements Action {
  readonly type = NewsActionTypes.NewsApiError;
  constructor(public payload: Error) { }
}

export class AddInitialClientArticles implements Action {
  readonly type = NewsActionTypes.AddInitialClientArticles;
  constructor(public payload: ArticlePayload) { }
}

export class SaveArticlesToClient implements Action {
  readonly type = NewsActionTypes.SaveArticlesToClient;
  constructor(public payload: ArticlePayload) { }
}

export class IndexedDbError implements Action {
  readonly type = NewsActionTypes.IndexedDbError;
  constructor(public payload: Error) { }
}

export class IndexedDbSaved implements Action {
  readonly type = NewsActionTypes.IndexedDbSaved;
  constructor(public payload: Category) { }
}



export type NewsActions =
    LoadNews
    | InitiateNews
    | AddNews
    | AddInitialArticles
    | AddInitialClientArticles
    | SaveArticlesToClient
    | IndexedDbError
    | NewsApiError
    | IndexedDbSaved;
