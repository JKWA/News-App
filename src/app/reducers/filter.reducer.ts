import { FilterActions, FilterActionTypes } from '../actions/filter.actions';
import { Filter } from '../models/filter';

export interface State {
  listOfFilters: Set<Filter>;
}

export const initialState: State = {
  listOfFilters: new Set ()
};

export function reducer(state = initialState, action: FilterActions): State {
  switch (action.type) {

    case FilterActionTypes.LoadFilters:
    case FilterActionTypes.LoadFiltersFailed: {
      return {
        ...state,
        listOfFilters: action.payload
      };
    }

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
