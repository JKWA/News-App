import { Action } from '@ngrx/store';
import { LogActions, LogActionTypes } from '../actions/log.actions';
import { Log } from '../models/log.model';
import * as moment from 'moment';

export interface State {
  logs: Map<string, Log>;
}

export const initialState: State = {
  logs: new Map()
};

export function reducer(state = initialState, action: LogActions): State {
  switch (action.type) {

    case LogActionTypes.LoadLogs:
      return state;

    case LogActionTypes.AddLog:
    {
      const time = action.payload.time;
      const type = action.payload.type;
      const copy = new Map(state.logs);
      const log = {time, type, number: 1 };
      copy.has(type)
        ? copy.set(type, {time, type, number: copy.get(type).number + 1})
        : copy.set(type, log);

      return {
        ...state,
        logs: copy
      };
    }
    case LogActionTypes.DeleteAllLogs: {
      return {
        ...state,
        logs: new Map()
      };
    }

    default:
      return state;
  }
}

export const getAllLogs = (state: State) => state.logs;

