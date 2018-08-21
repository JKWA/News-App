import { reducer, initialState, State } from './log.reducer';
import * as LogActions from '../actions/log.actions';
import {LogActionTypes} from '../actions/log.actions';
import { Log } from '../models/log.model';
import { Time } from '../utility/time.utility';


describe('Log Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;
      const result = reducer(initialState, action);
      expect(result).toBe(initialState);
    });
  });

  describe('Log actions', () => {

    it('"AddLog" should add a log to logs', () => {
      const firstState: State = {
        logs: new Map()
      };
      const type = LogActionTypes.AddLog;
      const logPayload: Log = {
        time: new Time().logFormat,
        type,
        number: 1
      };

      const action = new LogActions.AddLog(logPayload);
      const expectedResult: State = {
        logs: new Map().set(type, logPayload)
      };
      const result = reducer(firstState, action);
      expect(result).toEqual(expectedResult);
    });

    it('DeleteAllLogs should return empty array', () => {
      const type = LogActionTypes.AddLog;
      const logPayload: Log = {
        time: new Time().logFormat,
        type,
        number: 1
      };

      const firstState: State = {
        logs: new Map().set(type, logPayload)
      };

      const action = new LogActions.DeleteAllLogs();
      const expectedResult: State = {
        logs: new Map()
      };

      const result = reducer(firstState, action);
      expect(result).toEqual(expectedResult);
    });
  });
});
