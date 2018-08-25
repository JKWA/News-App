import { Action } from '@ngrx/store';
import { Category } from '../enums/category.enum';
import { Service } from '../enums/service.enum';
import { ServiceMessageModel } from '../models/service-message.model';
import { ArticlePayload } from '../models/article-payload.model';

export enum NewsActionTypes {
  InitiateNews = '[App Component] Initiating news call',
  GetAdditionalNewsFromApi = '[Article Component] Initiate additional news call',
  GetAdditionalNewsFromApiFailed = '[Article Component] Initiate additional news call failed',
  InsertAdditionalNewsFromApi = '[News Effects] Adding news',
  InsertAdditionalNewsFromApiFailed = '[News Effects] Adding news failed',
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


// export class LoadNews implements Action {
//   readonly type = NewsActionTypes.LoadNews;
// }

export class InitiateNews implements Action {
  readonly type = NewsActionTypes.InitiateNews;
  constructor(public payload: Category) { }
}

export class GetAdditionalNewsFromApi implements Action {
  readonly type = NewsActionTypes.GetAdditionalNewsFromApi;
  constructor(public payload: Category) { }
}

export class GetAdditionalNewsFromApiFailed implements Action {
  readonly type = NewsActionTypes.GetAdditionalNewsFromApiFailed;
  constructor(public payload: ServiceMessageModel) { }
}

export class AddInitialApiArticles implements Action {
  readonly type = NewsActionTypes.AddInitialApiArticles;
  constructor(public payload: ArticlePayload) { }
}

export class AddInitialApiArticlesFailed implements Action {
  readonly type = NewsActionTypes.AddInitialApiArticlesFailed;
  constructor(public payload: ServiceMessageModel) { }
}

export class InsertAdditionalNewsFromApi implements Action {
  readonly type = NewsActionTypes.InsertAdditionalNewsFromApi;
  constructor(public payload: ArticlePayload) { }
}

export class InsertAdditionalNewsFromApiFailed implements Action {
  readonly type = NewsActionTypes.InsertAdditionalNewsFromApiFailed;
  constructor(public payload: ServiceMessageModel) { }
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
    // LoadNews
    | InitiateNews
    | AddInitialApiArticles
    | AddInitialApiArticlesFailed
    | AddInitialClientArticles
    | AddInitialClientArticlesFailed
    | GetAdditionalNewsFromApi
    | GetAdditionalNewsFromApiFailed
    | InsertAdditionalNewsFromApi
    | InsertAdditionalNewsFromApiFailed
    | SaveArticlesToClient
    | SaveArticlesToClientFailed
    | GetExpiredData
    | GetExpiredDataFailed
    | DeleteExpiredData
    | DeleteExpiredDataFailed;

