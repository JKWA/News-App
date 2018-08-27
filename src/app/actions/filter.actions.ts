import { Action } from '@ngrx/store';
import { Filter } from '../models/filter';
import { ServiceMessageModel } from '../models/service-message.model';

export enum FilterActionTypes {
  InitFilters = '[Filter Effect] Init loading of filters',
  LoadFilters = '[Filter Effect] Load saved or default filters',
  LoadFiltersFailed = '[Filter Effect] Load default filters',
  AddFilter = '[Filter Component] Add filter',
  RemoveFilter = '[Filter Component] Remove filter',
  SavedFilterToClient = '[Filter Effect] Saved filter to local storage',
  SavedFilterToClientFailed = '[Filter Effect] Failed to save filter to local storage'
}

export class InitFilters implements Action {
  readonly type = FilterActionTypes.InitFilters;
}

export class LoadFilters implements Action {
  readonly type = FilterActionTypes.LoadFilters;
  constructor(public payload: Set<Filter>) { }
}

export class LoadFiltersFailed implements Action {
  readonly type = FilterActionTypes.LoadFiltersFailed;
  constructor(public payload: Set<Filter>) { }
}

export class AddFilter implements Action {
  readonly type = FilterActionTypes.AddFilter;
  constructor(public payload: Filter) { }
}

export class RemoveFilter implements Action {
  readonly type = FilterActionTypes.RemoveFilter;
  constructor(public payload: Filter) { }
}

export class SavedFilterToClient implements Action {
  readonly type = FilterActionTypes.SavedFilterToClient;
  constructor(public payload: ServiceMessageModel) { }
}

export class SavedFilterToClientFailed implements Action {
  readonly type = FilterActionTypes.SavedFilterToClientFailed;
  constructor(public payload: ServiceMessageModel) { }
}

export type FilterActions =
  LoadFilters
  | LoadFiltersFailed
  | AddFilter
  | RemoveFilter
  | SavedFilterToClient
  | SavedFilterToClientFailed;
