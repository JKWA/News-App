import { Action } from '@ngrx/store';
import { OnlineActions, OnlineActionTypes } from '../actions/online.actions';

export interface State {
  online: boolean;

}

export const initialState: State = {
  online: true
};

export function reducer(state = initialState, action: OnlineActions): State {
  switch (action.type) {

    case OnlineActionTypes.LoadOnline:
      return state;

    case OnlineActionTypes.Online: {
      return {
        ...state,
        online: true
      };
    }

    case OnlineActionTypes.Offline: {
      return {
        ...state,
        online: false
      };
    }

    default:
      return state;
  }
}

export const getOnlineStatus = (state: State) => state.online;

