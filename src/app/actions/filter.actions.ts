import { Action } from '@ngrx/store';
import { Filter } from '../models/filter';
import { ServiceMessageModel } from '../models/service-message.model';

export enum FilterActionTypes {
  LoadFilters = '[Filter] Load filters',
  AddFilter = '[Filter Category] Add filter',
  RemoveFilter = '[Filter Category] Remove filter',
  SavedFilterToClient = '[Filter Effect] Saved filter to local storage',
  SavedFilterToClientFailed = '[Filter Effect] Failed to save filter to local storage'
}

export class LoadFilters implements Action {
  readonly type = FilterActionTypes.LoadFilters;
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
  | AddFilter
  | RemoveFilter
  | SavedFilterToClient
  | SavedFilterToClientFailed;
