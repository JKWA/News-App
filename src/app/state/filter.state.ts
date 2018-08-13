import {Store, Selector, State, Action, StateContext } from '@ngxs/store';
import { UpdateState } from './log.state';

// TODO add filter view for just the list of filters and update filter component

export type Filter = string;

/**
   * Add filter
   * @param fliter - filter to add
   */
export class AddFilter {
  static readonly type = '[Filter Component] AddFilter';
  constructor(
    public filterToAdd: Filter
  ) {}
}

/**
   * Remove filter
   * @param fliter - filter to remove
   */
export class RemoveFilter {
  static readonly type = '[Filter Component] RemoveFilter';
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

  @Selector() static allFilters(state: FilterStateModel): Set<Filter> {
    return state.listOfFilters;
  }

/**
 * add a new filter
 *
 * @param {StateContext<FilterStateModel>} ctx
 * @param {AddFilter} action
 * @memberof FilterState
 */
@Action(AddFilter)
  addFilter(ctx: StateContext<FilterStateModel>, action: AddFilter) {
    const currentState = Object.assign({}, ctx.getState());

    const state = ctx.getState();
    const copy = new Set(state.listOfFilters);
    copy.add(action.filterToAdd);
    copy.delete('$NONE$');

    window.localStorage.setItem('filters', Array.from(copy).join());

    ctx.patchState({
      listOfFilters: copy
    });
     // add to dev log
     this.store.dispatch(new UpdateState('Filter', `add ${action.filterToAdd}`, currentState, ctx.getState()));

  }

/**
 * remove an existing filter
 *
 * @param {StateContext<FilterStateModel>} ctx
 * @param {RemoveFilter} action
 * @memberof FilterState
 */
@Action(RemoveFilter)
  removeFilter(ctx: StateContext<FilterStateModel>, action: RemoveFilter) {
    const currentState = Object.assign({}, ctx.getState());

    const copy = new Set(ctx.getState().listOfFilters);
    copy.delete(action.filterToRemove);

    ( copy.size )
      ? window.localStorage.setItem('filters', Array.from(copy).join())
      : window.localStorage.setItem('filters', '$NONE$');

    ctx.patchState({
      listOfFilters: copy
    });

    // add to dev log
    this.store.dispatch(new UpdateState('Filter', `remove ${action.filterToRemove}`, currentState, ctx.getState()));

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


