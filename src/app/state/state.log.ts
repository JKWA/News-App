import { isDevMode } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import * as moment from 'moment';

export type Filter = string;

export class AddMessage {
  static readonly type = 'AddMessage';
  constructor(
    public location: string,
    public message: string,
  ) {
  }
}

export class AddError {
  static readonly type = 'AddError';
  constructor(
    public location: string,
    public message: string,
  ) {
  }
}

export class CurrentState {
  static readonly type = 'CurrentState';
  constructor(
    public state: any,
  ) {
  }
}

export class NewState {
  static readonly type = 'NewState';
  constructor(
    public location: string,
    public state: any,
  ) {
  }
}



export class ClearLog {
  static readonly type = 'ClearLog';
  constructor() {}
}


export interface Log {
    location: string;
    message: string;
    time: string;
    type: string;
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

  @Action(AddMessage)
  addMessage(ctx: StateContext<LogStateModel>, action: AddMessage) {
    const location = action.location;
    const message = action.message;
    const state = ctx.getState();
    const date: moment.Moment = moment(new Date());
    const type = 'message';

    const copy = state.logs.slice(0);
    copy.push(
        {location, message, time: date.format('LTS'), type}
    );

    ctx.patchState({
      logs: copy
    });
    if ( isDevMode() ) {
      console.log(`%c ${date.format('kk:mm:ss')} - ${location}: ${message}`, 'background: #D35400; color: white');
    }
  }

  @Action(AddError)
  addError(ctx: StateContext<LogStateModel>, action: AddError) {
    const location = action.location;
    const message = action.message;
    const state = ctx.getState();
    const date: moment.Moment = moment(new Date());
    const type = 'error';

    const copy = state.logs.slice(0);
    copy.push(
        {location, message, time: date.format('LTS'), type}
    );

    ctx.patchState({
      logs: copy
    });

    if ( isDevMode() ) {
      console.log(`%c ${date.format('kk:mm:ss')} - ${location}: ${message}`, 'background: red; color: white');
    }
  }

  @Action(CurrentState)
  currentState(ctx: StateContext<LogStateModel>, action: CurrentState) {

    if ( isDevMode() ) {
      console.log(`%c Current state `, 'background: #08298A; color: white', action.state );
    }
    // do not add to log state

  }

  @Action(NewState)
  newState(ctx: StateContext<LogStateModel>, action: NewState) {

    if ( isDevMode() ) {
      console.log(`%c New state `, 'background: #088A08; color: white', action.state);
    }

    const location = action.location;
    const message = 'state changed';
    const state = ctx.getState();
    const date: moment.Moment = moment(new Date());
    const type = 'state_change';

    const copy = state.logs.slice(0);
    copy.push(
        {location, message, time: date.format('LTS'), type}
    );

    ctx.patchState({
      logs: copy
    });
  }


  @Action(ClearLog)
  ClearLog(ctx: StateContext<LogStateModel>, action: ClearLog) {
    console.log('clearaction');
    ctx.patchState({
      logs: []
    });
  }
}



