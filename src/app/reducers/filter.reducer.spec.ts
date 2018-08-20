import { reducer, initialState, State } from './filter.reducer';
import * as FilterActions from '../actions/filter.actions';

describe('Filter Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });

    describe('Filter actions', () => {

      it('"AddFilter" should add a filter to listOfFilters', () => {
        const firstState: State = {
          listOfFilters: new Set(['trump', 'sanders'])
        };
        const action = new FilterActions.AddFilter('test');
        const expectedResult: State = {
          listOfFilters: new Set(['trump', 'sanders', 'test'])
        };

        const result = reducer(firstState, action);
        expect(result).toEqual(expectedResult);
      });

      it('"RemoveFilter" should remove a filter from listOfFilters', () => {
        const firstState: State = {
          listOfFilters: new Set(['trump', 'sanders'])
        };
        const action = new FilterActions.RemoveFilter('trump');
        const expectedResult: State = {
          listOfFilters: new Set(['sanders'])
        };

        const result = reducer(firstState, action);
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
