import { Action } from '@ngrx/store';
import { NewsSection } from '../enums/news-section.enum';
import { ServiceMessageModel } from '../models/service-message.model';
import { State } from '../reducers/news-section.reducer';
export enum NewsSectionActionTypes {
  InitNewsSections = '[ROOT_EFFECTS_INIT] Initialize news section store',
  LoadNewsSections = '[NewsSection Effect] Load either saved or default categories',
  LoadNewsSectionsFailed = '[NewsSection Effect] Load default categories',
  AddNewsSection = '[NewsSection Component] Add selected news section',
  AddGeneralNewsSection = '[NewsSection Effects] Add general news section',
  RemoveNewsSection = '[NewsSection Component] Remove selected news section',
  SetCurrentlyViewingNewsSection = '[News Component] Set viewed news section',
  SetCurrentlyViewingNewsSectionFailed = '[News Component] Set viewed news section failed',
  SavedSelectedNewsSections = '[NewsSection Effect] Saved selected news section',
  SavedSelectedNewsSectionsFailed = '[NewsSection Effect] Saved selected news section',
  SavedViewedNewsSection = '[NewsSection Effect] Saved viewed news section',
  SavedViewedNewsSectionFailed = '[NewsSection Effect] Failed to save viewed news section',
}

export class InitNewsSections implements Action {
  readonly type = NewsSectionActionTypes.InitNewsSections;
}

export class LoadNewsSections implements Action {
  readonly type = NewsSectionActionTypes.LoadNewsSections;
  constructor(public payload: State) { }
}

export class LoadNewsSectionsFailed implements Action {
  readonly type = NewsSectionActionTypes.LoadNewsSectionsFailed;
  constructor(public payload: State) { }
}

export class AddNewsSection implements Action {
  readonly type = NewsSectionActionTypes.AddNewsSection;
  constructor(public payload: NewsSection) { }
}

export class AddGeneralNewsSection implements Action {
  readonly type = NewsSectionActionTypes.AddGeneralNewsSection;
}

export class RemoveNewsSection implements Action {
  readonly type = NewsSectionActionTypes.RemoveNewsSection;
  constructor(public payload: NewsSection) { }
}

export class SetCurrentlyViewingNewsSection implements Action {
  readonly type = NewsSectionActionTypes.SetCurrentlyViewingNewsSection;
  constructor(public payload: NewsSection) { }
}

export class SetCurrentlyViewingNewsSectionFailed implements Action {
  readonly type = NewsSectionActionTypes.SetCurrentlyViewingNewsSectionFailed;
  constructor(public payload: NewsSection) { }
}

export class SavedSelectedNewsSections implements Action {
  readonly type = NewsSectionActionTypes.SavedSelectedNewsSections;
  constructor(public payload: ServiceMessageModel) { }
}

export class SavedSelectedNewsSectionsFailed implements Action {
  readonly type = NewsSectionActionTypes.SavedSelectedNewsSectionsFailed;
  constructor(public payload: ServiceMessageModel) { }
}

export class SavedViewedNewsSection implements Action {
  readonly type = NewsSectionActionTypes.SavedViewedNewsSection;
  constructor(public payload: ServiceMessageModel) { }
}

export class SavedViewedNewsSectionFailed implements Action {
  readonly type = NewsSectionActionTypes.SavedViewedNewsSectionFailed;
  constructor(public payload: ServiceMessageModel) { }
}

export type NewsSectionActions =
  InitNewsSections
  | LoadNewsSections
  | LoadNewsSectionsFailed
  | AddNewsSection
  | AddGeneralNewsSection
  | RemoveNewsSection
  | SetCurrentlyViewingNewsSection
  | SetCurrentlyViewingNewsSectionFailed
  | SavedSelectedNewsSections
  | SavedSelectedNewsSectionsFailed
  | SavedViewedNewsSection
  | SavedViewedNewsSectionFailed;
