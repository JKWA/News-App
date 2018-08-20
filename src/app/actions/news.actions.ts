import { Action } from '@ngrx/store';
import { Category } from '../enums/category.enum';
import { Article } from '../models/article.model';
import { Error } from '../models/error.model';
import { Service } from '../enums/service.enum';
import { ServiceMessageModel } from '../models/service-message.model';

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
  NewsApiError = '[News Effects] News API error',
  GetExpiredData = '[News Effects] Get expired data from IndexedDb',
  GetExpiredDataFailed = '[News Effects] Get expired data from IndexedDb failed',
  DeleteExpiredData = '[News Effects] Delete expired data from IndexedDb',
  DeleteExpiredDataFailed = '[News Effects] Delete expired data from IndexedDb failed'
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

export interface ArticlePayload {
  category: Category;
  articles: any;
  service: Service;
}

export class AddInitialArticles implements Action {
  readonly type = NewsActionTypes.AddInitialArticles;
  constructor(public payload: ArticlePayload) { }
}

export class NewsApiError implements Action {
  readonly type = NewsActionTypes.NewsApiError;
  constructor(public payload: any) { }
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

export class GetExpiredData implements Action {
  readonly type = NewsActionTypes.GetExpiredData;
  constructor(public payload: number[]) { }
}

export class GetExpiredDataFailed implements Action {
  readonly type = NewsActionTypes.GetExpiredDataFailed;
  constructor(public payload: ServiceMessageModel) { }
}

export class DeleteExpiredData implements Action {
  readonly type = NewsActionTypes.DeleteExpiredData;
  constructor(public payload: ServiceMessageModel) { }
}

export class DeleteExpiredDataFailed implements Action {
  readonly type = NewsActionTypes.DeleteExpiredDataFailed;
  constructor(public payload: ServiceMessageModel) { }
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
    | IndexedDbSaved
    | GetExpiredData
    | GetExpiredDataFailed
    | DeleteExpiredData
    | DeleteExpiredDataFailed;

