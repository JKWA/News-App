import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromCategory from './category.reducer';
import * as fromFilter from './filter.reducer';
import * as fromAppStatus from './app-status.reducer';

import * as fromLog from './log.reducer';
import * as fromNews from './news.reducer';

export const getCategoryState = createFeatureSelector<fromCategory.State>('category');
export const getFilterState = createFeatureSelector<fromFilter.State>('filter');
export const getLogState = createFeatureSelector<fromLog.State>('log');
export const getNewsState = createFeatureSelector<fromNews.State>('news');
export const getAppStatusState = createFeatureSelector<fromAppStatus.State>('appStatus');
export interface State {
  filter: fromFilter.State;
  category: fromCategory.State;
  log: fromLog.State;
  news: fromNews.State;
  appStatus: fromAppStatus.State;
}

export const reducers: ActionReducerMap<State> = {
  filter: fromFilter.reducer,
  appStatus: fromAppStatus.reducer,
  category: fromCategory.reducer,
  log: fromLog.reducer,
  news: fromNews.reducer
};

export const getAllCategories = createSelector(
  getCategoryState,
  fromCategory.getAllCategories
);

export const getViewingCategory = createSelector(
  getCategoryState,
  fromCategory.getViewingCategory
);

export const getAllFilters = createSelector(
  getFilterState,
  fromFilter.getAllFilters
);

export const getAllLogs = createSelector(
  getLogState,
  fromLog.getAllLogs
);

export const getOnlineState = createSelector(
  getAppStatusState,
  fromAppStatus.getOnlineState
);

export const getDeviceState = createSelector(
  getAppStatusState,
  fromAppStatus.getDeviceState
);

export const getStandaloneState = createSelector(
  getAppStatusState,
  fromAppStatus.getStandaloneState
);

export const getAllArticles = createSelector(
  getNewsState,
  fromNews.getAllArticles
);


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
