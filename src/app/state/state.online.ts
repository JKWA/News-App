import {Store, State, Action, StateContext, Selector } from '@ngxs/store';
import { UpdateState } from './state.log';

/**
   * adds category to possibly be displayed
   * @param category - category enum
   */
  export class UpdateOnline {
    static readonly type = 'UpdateOnline';
    constructor(
      public online: boolean
    ) {}
  }


export interface OnlineStateModel {
  online: boolean;
}

@State<OnlineStateModel>({
  name: 'online',
  defaults: {
    online: true
  }
})

export class OnlineState {


  @Selector() static online(state: OnlineStateModel): boolean {
    return state.online;
  }


  constructor(
    private store: Store
  ) { }

  @Action( UpdateOnline)
  updateOnline(ctx: StateContext<OnlineStateModel>, action: UpdateOnline) {
    const currentState = Object.assign({}, ctx.getState());

    ctx.patchState({
      online: action.online
    });

    // add to dev log
    this.store.dispatch(new UpdateState('OnlineStatus', `changing ${action.online}`, currentState, ctx.getState()));

  }


}






