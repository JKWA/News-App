import { State, Action, StateContext } from '@ngxs/store';

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
  @Action(AddFilter)
  addFilter(ctx: StateContext<FilterStateModel>, action: AddFilter) {
    // console.log('ADDFILTER: ' + action.filterToAdd);

    const state = ctx.getState();
    state.listOfFilters.add(action.filterToAdd);
    window.localStorage.setItem('filters', Array.from(state.listOfFilters).join());

    ctx.setState({
      ...state,
      listOfFilters: state.listOfFilters
    });
  }

  @Action(RemoveFilter)
  removeFilter(ctx: StateContext<FilterStateModel>, action: RemoveFilter) {
    console.log('REMOVEFILTER: ' + action.filterToRemove);
    const state = ctx.getState();
    state.listOfFilters.delete(action.filterToRemove);
    window.localStorage.setItem('filters', Array.from(state.listOfFilters).join());

    ctx.setState({
      ...state,
      listOfFilters: state.listOfFilters
    });
  }
}

function convertToFilter(filterString: string): Set<Filter> {
  const listOfFilters = [];
  // console.log('FILTER: ' + filterString);
  filterString.split(',').map(filter => {
      listOfFilters.push(filter.trim());
    });

  return new Set(listOfFilters);
}


