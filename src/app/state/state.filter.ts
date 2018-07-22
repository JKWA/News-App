import {Store, State, Action, StateContext } from '@ngxs/store';
import { AddMessage, CurrentState, NewState } from './state.log';


export type Filter = string;

export class AddFilter {
  static readonly type = 'AddFilter';
  constructor(
    public filterToAdd: Filter
  ) {}
}

export class RemoveFilter {
  static readonly type = 'RemoveFilter';
  constructor(
    public filterToRemove: Filter
  ) {}
}


export interface FilterStateModel {
  listOfFilters: Set<Filter>;
}

@State<FilterStateModel>({
  name: 'listOfFilters',
  defaults: {
    listOfFilters: (window.localStorage.getItem('filters'))
      ? convertToFilter(window.localStorage.getItem('filters'))
      : new Set ([ 'trump', 'sanders' ])
  }
})


export class FilterState {

  constructor(
    private store: Store
  ) { }

  @Action(AddFilter)
  addFilter(ctx: StateContext<FilterStateModel>, action: AddFilter) {

    this.store.dispatch(new AddMessage('Filter', `add ${action.filterToAdd}`));
    this.store.dispatch(new CurrentState(ctx.getState()));

    const state = ctx.getState();
    const copy = new Set(state.listOfFilters);
    copy.add(action.filterToAdd);
    copy.delete('$NONE$');

    window.localStorage.setItem('filters', Array.from(copy).join());

    ctx.patchState({
      listOfFilters: copy
    });

    this.store.dispatch(new NewState('Filter', ctx.getState()));

  }

  @Action(RemoveFilter)
  removeFilter(ctx: StateContext<FilterStateModel>, action: RemoveFilter) {

    this.store.dispatch(new AddMessage('Filter', `add ${action.filterToRemove}`));
    this.store.dispatch(new CurrentState(ctx.getState()));

    const copy = new Set(ctx.getState().listOfFilters);
    copy.delete(action.filterToRemove);

    ( copy.size )
      ? window.localStorage.setItem('filters', Array.from(copy).join())
      : window.localStorage.setItem('filters', '$NONE$');

    ctx.patchState({
      listOfFilters: copy
    });

    this.store.dispatch(new NewState('Filter', ctx.getState()));
  }
}

function convertToFilter(filterString: string): Set<Filter> {
  const listOfFilters = [];

  if (filterString !== '$NONE$') {
    filterString.split(',').map(filter => {
      listOfFilters.push(filter.trim());
    });
  }

  return new Set(listOfFilters);
}


