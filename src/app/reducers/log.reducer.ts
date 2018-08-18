import { Action } from '@ngrx/store';
import { LogActions, LogActionTypes } from '../actions/log.actions';
import { Log } from '../models/log.model';
import * as moment from 'moment';

export interface State {
  logs: Log[];
}

export const initialState: State = {
  logs: []
};

export function reducer(state = initialState, action: LogActions): State {
  switch (action.type) {

    case LogActionTypes.LoadLogs:
      return state;

    case LogActionTypes.AddLogFromCategoryEffect:
    case LogActionTypes.AddLogFromFilterEffect:
    {
      const location = action.payload.location;
      const message = action.payload.message;
      const date: moment.Moment = moment(new Date());
      const type = 'message';
      const copy = state.logs.slice(0);

      copy.push(
          {location, message, time: date.format('LTS'), type}
      );
      return {
        ...state,
        logs: copy
      };
    }
    case LogActionTypes.DeleteAllLogs: {
      return {
        ...state,
        logs: []
      };
    }

    default:
      return state;
  }
}

export const getAllLogs = (state: State) => state.logs;

