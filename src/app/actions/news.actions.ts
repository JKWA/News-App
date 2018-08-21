import { Action } from '@ngrx/store';
import { Category } from '../enums/category.enum';
import { Service } from '../enums/service.enum';
import { ServiceMessageModel } from '../models/service-message.model';

export enum NewsActionTypes {
  LoadNews = '[News] Load Users',
  InitiateNews = '[App Component] Initiating news call',
  AddNews = '[Article Component] Adding news',
  RetrievingNews = '[Article Component] Retrieving initial news articles',
  AddInitialApiArticles = '[News Effects] Add initial news articles from API',
  AddInitialClientArticles = '[News Effects] Add initial news articles from client',
  AddInitialClientArticlesFailed = '[News Effects] Add initial news articles from client failed',
  SaveArticlesToClient = '[News Effects] save articles to client',
  SaveArticlesToClientFailed = '[News Effects] Indexed db error',
  AddInitialApiArticlesFailed = '[News Effects] News API error',
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
  readonly type = NewsActionTypes.AddInitialApiArticles;
  constructor(public payload: any) { }
}

export interface ArticlePayload {
  category: Category;
  articles: any;
  service: Service;
}

export class AddInitialApiArticles implements Action {
  readonly type = NewsActionTypes.AddInitialApiArticles;
  constructor(public payload: ArticlePayload) { }
}

export class AddInitialApiArticlesFailed implements Action {
  readonly type = NewsActionTypes.AddInitialApiArticlesFailed;
  constructor(public payload: any) { }
}

export class AddInitialClientArticles implements Action {
  readonly type = NewsActionTypes.AddInitialClientArticles;
  constructor(public payload: ArticlePayload) { }
}

export class AddInitialClientArticlesFailed implements Action {
  readonly type = NewsActionTypes.AddInitialClientArticlesFailed;
  constructor(public payload: ServiceMessageModel) { }
}

export class SaveArticlesToClient implements Action {
  readonly type = NewsActionTypes.SaveArticlesToClient;
  constructor(public payload: ServiceMessageModel) { }
}

export class SaveArticlesToClientFailed implements Action {
  readonly type = NewsActionTypes.SaveArticlesToClientFailed;
  constructor(public payload: ServiceMessageModel) { }
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
    | AddInitialApiArticles
    | AddInitialClientArticles
    | AddInitialClientArticlesFailed
    | SaveArticlesToClient
    | SaveArticlesToClientFailed
    | AddInitialApiArticlesFailed
    | GetExpiredData
    | GetExpiredDataFailed
    | DeleteExpiredData
    | DeleteExpiredDataFailed;

