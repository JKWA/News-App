import { isDevMode } from '@angular/core';
import { State, Action, StateContext , Selector } from '@ngxs/store';
import * as moment from 'moment';

export type Filter = string;

 /**
   * Add log message for dev mode
   * @param location - service or component logging
   * @param message - message to log
   */
export class AddMessage {
  static readonly type = 'AddMessage';
  constructor(
    public location: string,
    public message: string,
  ) {
  }
}

 /**
   * Add log error and show when in dev mode
   * @param location - service or component logging
   * @param message - message to log
   */
export class AddError {
  static readonly type = 'AddError';
  constructor(
    public location: string,
    public message: string,
  ) {
  }
}

 /**
   * Add current state and show when in dev mode
   * @param state - the state
   */
  export class UpdateState {
    static readonly type = 'UpdateState';
    constructor(
      public location: string,
      public message: string,
      public currentState: any,
      public newState: any,
    ) {
    }
  }


/**
   * Removes application logs
   */
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
/**
 * gets messages and errors
 *
 * @static
 * @param {LogStateModel} state
 * @returns {Log[]}
 * @memberof LogState
 */
@Selector() static allMessageLogs(state: LogStateModel): Log[] {
    return  Array.from(state.logs).filter(log => log.type !== 'state_change');
  }

/**
 * adds a new message to the log
 * console logs in dev mode
 *
 * @param {StateContext<LogStateModel>} ctx
 * @param {AddMessage} action
 * @memberof LogState
 */
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

    // if ( isDevMode() ) {
      console.log(`%c ${date.format('kk:mm:ss')} - ${location}: ${message}`, 'background: #D35400; color: white');
    // }
  }

/**
 * adds a new error to the log
 * console logs in dev mode
 *
 * @param {StateContext<LogStateModel>} ctx
 * @param {AddError} action
 * @memberof LogState
 */
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

    // if ( isDevMode() ) {
      console.log(`%c ${date.format('kk:mm:ss')} - ${location}: ${message}`, 'background: red; color: white');
    // }
  }
/**
 * console logs the updated state in dev mode
 *
 * @param {StateContext<LogStateModel>} ctx
 * @param {UpdateState} action
 * @memberof LogState
 */
@Action(UpdateState)
  updateState(ctx: StateContext<LogStateModel>, action: UpdateState) {
    const location = action.location;
    const message = action.message;
    const state = ctx.getState();
    const date: moment.Moment = moment(new Date());
    const type = 'message';

    // flag to turn off console logs in production
    // if ( isDevMode() ) {
      console.log(`%c ${date.format('kk:mm:ss')} - ${location}: ${message}`, 'background: #D35400; color: white');
      console.log(`%c Current state `, 'background: #08298A; color: white', action.currentState );
      console.log(`%c New state `, 'background: #088A08; color: white', action.newState);
  // }

    const copy = state.logs.slice(0);
    copy.push(
        {location, message, time: date.format('LTS'), type}
    );

    ctx.patchState({
      logs: copy
    });
  }

/**
 * clear the dev log
 *
 * @param {StateContext<LogStateModel>} ctx
 * @param {ClearLog} action
 * @memberof LogState
 */
@Action(ClearLog)
  ClearLog(ctx: StateContext<LogStateModel>, action: ClearLog) {
    const date: moment.Moment = moment(new Date());

    console.log(`%c ${date.format('kk:mm:ss')} - Log: cleared`, 'background: #D35400; color: white');

    ctx.patchState({
      logs: []
    });
  }
}



