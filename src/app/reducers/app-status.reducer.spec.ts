import { reducer, initialState, State } from './app-status.reducer';
import * as AppStatusActions from '../actions/app-status.actions';
import { Device } from '../enums/device.enum';

describe('AppStatus Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });

    describe('AppStatus actions', () => {

      it('"Offline" should change online status to false', () => {
        const action = new AppStatusActions.Offline();
        const result = reducer(initialState, action);
        expect(result).toEqual(Object.assign({}, initialState, {online: false}));
      });

      it('"Online" should change online status to true', () => {
        const action = new AppStatusActions.Online();
        const result = reducer(Object.assign({}, initialState, {online: false}), action);
        expect(result).toEqual(Object.assign({}, initialState, {online: true}));
      });

      it('"SetDevice" should change device', () => {
        const action = new AppStatusActions.SetDevice(Device.Iphone);
        const result = reducer(Object.assign({}, initialState, {device: Device.Computer}), action);
        expect(result).toEqual(Object.assign({}, initialState, {device: Device.Iphone}));
      });

      it('"SetStandalone" should change device', () => {
        const action = new AppStatusActions.SetStandalone(false);
        const result = reducer(Object.assign({}, initialState, {standalone: true}), action);
        expect(result).toEqual(Object.assign({}, initialState, {standalone: false}));
      });

    });
  });
});
