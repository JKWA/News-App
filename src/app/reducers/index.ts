import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromUser from './user.reducer';
import * as fromCategory from './category.reducer';
import * as fromFilter from './filter.reducer';
import * as fromLog from './log.reducer';
import * as fromOnline from './online.reducer';
import * as fromNews from './news.reducer';

export const getCategoryState = createFeatureSelector<fromCategory.State>('category');
export const getFilterState = createFeatureSelector<fromFilter.State>('filter');
export const getLogState = createFeatureSelector<fromLog.State>('log');
export const getOnlineState = createFeatureSelector<fromOnline.State>('online');
export const getNewsState = createFeatureSelector<fromNews.State>('news');

export interface State {
  user: fromUser.State;
  filter: fromFilter.State;
  category: fromCategory.State;
  log: fromLog.State;
  news: fromNews.State;
}

export const reducers: ActionReducerMap<State> = {
  user: fromUser.reducer,
  filter: fromFilter.reducer,
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

export const getOnlineStatus = createSelector(
  getOnlineState,
  fromOnline.getOnlineStatus
);

export const getAllArticles = createSelector(
  getNewsState,
  fromNews.getAllArticles
);


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
