import { isDevMode } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import * as moment from 'moment';

export type Filter = string;

export class AddLog {
  static readonly type = 'AddLog';
  constructor(
    public location: string,
    public message: string
  ) {}
}

export class ClearLog {
  static readonly type = 'ClearLog';
  constructor() {}
}


export interface Log {
    location: string;
    message: string;
    time: string;
}

export interface LogStateModel {
    logs: Log[];
}

@State<LogStateModel>({
  name: 'applicationLogs',
  defaults: {
    logs: []
  }
})


export class LogState {
  @Action(AddLog)
  addLog(ctx: StateContext<LogStateModel>, action: AddLog) {
    const location = action.location;
    const message = action.message;
    const state = ctx.getState();
    const date: moment.Moment = moment(new Date());

    const copy = state.logs.slice(0);
    copy.push(
        {location, message, time: date.format('LTS')}
    );

    ctx.patchState({
      logs: copy
    });
    if ( isDevMode ) {
      console.log(`${date.format('kk:mm:ss')} - ${location}: ${message}`);
    }
  }

  @Action(ClearLog)
  ClearLog(ctx: StateContext<LogStateModel>, action: ClearLog) {

    ctx.patchState({
      logs: []
    });
  }
}



