import { Action } from '@ngrx/store';
import { AppStatusActions, AppStatusActionTypes } from '../actions/app-status.actions';
import { Device } from '../enums/device.enum';

export interface State {
  online: boolean;
  device: Device;
  standalone: boolean;
}

export const initialState: State = {
  online: true,
  device: Device.Computer,
  standalone: true
};

export function reducer(state = initialState, action: AppStatusActions): State {
  switch (action.type) {

    case AppStatusActionTypes.LoadAppStatus:
      return state;

    case AppStatusActionTypes.SetAppStatus: {
      return {
        ...state,
        online: action.payload.online,
        device: action.payload.device,
      };
    }

    case AppStatusActionTypes.Online: {
      return {
        ...state,
        online: true
      };
    }

    case AppStatusActionTypes.Offline: {
      return {
        ...state,
        online: false
      };
    }

    case AppStatusActionTypes.SetDevice: {
      return {
        ...state,
        device: action.payload
      };
    }

    case AppStatusActionTypes.SetStandalone: {
      return {
        ...state,
        standalone: action.payload
      };
    }


    default:
      return state;
  }
}

export const getOnlineState = (state: State) => state.online;
export const getDeviceState = (state: State) => state.device;
export const getStandaloneState = (state: State) => state.standalone;

