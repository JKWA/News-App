import { TestBed } from '@angular/core/testing';
import { Observable, empty } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { FilterEffects } from './filter.effects';
import * as fromFilter from './../reducers';
import * as FilterActions from './../actions/filter.actions';
import { ServiceMessageModel } from '../models/service-message.model';
import { LocalStorageMessage } from '../messages/service.messages';
import { LocalStorageService } from './../services/local-storage.service';


export class TestActions extends Actions {
  constructor() {
    super(empty());
  }

  set stream(source: Observable<any>) {
    this.source = source;
  }
}

export function getActions() {
  return new TestActions();
}

class MockStorageService {
  setFilters = jasmine.createSpy('setFilters');
  getFilters = jasmine.createSpy('getFilters');

}

describe('FilterEffects', () => {
  let effects: FilterEffects;
  let actions$: TestActions;
  let storageService: MockStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FilterEffects,
        provideMockActions(() => actions$),
        { provide: LocalStorageService, useClass: MockStorageService },
        { provide: Actions, useFactory: getActions },
      ],
      imports: [
        StoreModule.forRoot({...fromFilter.reducers}),
      ],
    });

  effects = TestBed.get(FilterEffects);
  storageService = TestBed.get(LocalStorageService);
  actions$ = TestBed.get(Actions);
  });

  it('Filter Effect should be created', () => {
    expect(effects).toBeTruthy();
  });

  it('AddFilter should return a SavedFilterToClient, with message, on success', () => {
    const serviceMessage: ServiceMessageModel = new LocalStorageMessage().successMessage;
    const action = new FilterActions.AddFilter('new_filter');
    const completion = new FilterActions.SavedFilterToClient(serviceMessage);

    actions$.stream = hot('-a', { a: action });
    const response = cold('-b|', { b: new Set(['trump', 'sanders', 'test_filter'])});
    const expected = cold('--c', { c: completion });
    storageService.setFilters.and.returnValue(response);
    expect(effects.setFilters$).toBeObservable(expected);
  });

  it('AddFilter should return a SavedFilterToClientFailed, with message, on failure', () => {
    const serviceMessage: ServiceMessageModel = new LocalStorageMessage().errorMessage;
    const action = new FilterActions.AddFilter('new_filter');
    const completion = new FilterActions.SavedFilterToClientFailed(serviceMessage);

    actions$.stream = hot('-a', { a: action });
    const response = cold('-#|', {}, serviceMessage);
    const expected = cold('--b', { b: completion });
    storageService.setFilters.and.returnValue(response);
    expect(effects.setFilters$).toBeObservable(expected);
  });

});
