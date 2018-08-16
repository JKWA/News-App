import { Action } from '@ngrx/store';
import { Filter } from '../models/filter';

export enum FilterActionTypes {
  LoadFilters = '[Filter] Load Filters',
  AddFilter = '[Filter Category] Add Filter',
  RemoveFilter = '[Filter Category] Remove Filter'
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

export type FilterActions =
  LoadFilters
  | AddFilter
  | RemoveFilter;
