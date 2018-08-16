import { Action } from '@ngrx/store';
import { FilterActions, FilterActionTypes } from '../actions/filter.actions';
import { Filter } from '../models/filter';

export interface State {
  listOfFilters: Set<Filter>;

}

export const initialState: State = {
  listOfFilters: (window.localStorage.getItem('filters'))
  ? convertToFilter(window.localStorage.getItem('filters'))
  : new Set ([ 'trump', 'sanders' ])
};

export function reducer(state = initialState, action: FilterActions): State {
  switch (action.type) {

    case FilterActionTypes.LoadFilters:
      return state;

    case FilterActionTypes.AddFilter: {
      const copy = new Set(state.listOfFilters);
      copy.add(action.payload);
      copy.delete('$NONE$');
      return {
        ...state,
        listOfFilters: copy
      };
    }

    case FilterActionTypes.RemoveFilter: {
      const copy = new Set(state.listOfFilters);
      copy.delete(action.payload);
      copy.delete('$NONE$');
      return {
        ...state,
        listOfFilters: copy
      };
    }

    default:
      return state;
  }
}

export const getAllFilters = (state: State) => state.listOfFilters;

function convertToFilter(filterString: string): Set<Filter> {
  const listOfFilters = [];

  if (filterString !== '$NONE$') {
    filterString.split(',').map(filter => {
      listOfFilters.push(filter.trim());
    });
  }

  return new Set(listOfFilters);
}
