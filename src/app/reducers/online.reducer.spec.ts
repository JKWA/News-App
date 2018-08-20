import { reducer, initialState, State } from './online.reducer';
import * as OnlineActions from '../actions/online.actions';

describe('Online Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('Online actions', () => {

    it('"Offline" should change online status to false', () => {
      const firstState: State = {
        online: true
      };
      const action = new OnlineActions.Offline();
      const expectedResult: State = {
        online: false
      };

      const result = reducer(firstState, action);
      expect(result).toEqual(expectedResult);
    });

    it('"Online" should change online status to true', () => {
      const firstState: State = {
        online: false
      };
      const action = new OnlineActions.Online();
      const expectedResult: State = {
        online: true
      };

      const result = reducer(firstState, action);
      expect(result).toEqual(expectedResult);
    });
  });
});
