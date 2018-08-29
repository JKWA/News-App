import { Action } from '@ngrx/store';
import { NewsActions, NewsActionTypes } from '../actions/news.actions';
import { NewsDataModel } from '../models/news-data.model';
import { removeDuplicateTitles } from '../shared/utility/article.utility';
import { Service } from '../enums/service.enum';

export interface State {
  business: NewsDataModel;
  entertainment: NewsDataModel;
  general: NewsDataModel;
  health: NewsDataModel;
  science: NewsDataModel;
  sports: NewsDataModel;
  technology: NewsDataModel;
}

const defaultValue: NewsDataModel = {
  retrieving: false,
  page: 1,
  firstLoadComplete: false,
  clientDataLoaded: false,
  articles: []
};

export const initialState: State = {
  business: Object.assign({}, defaultValue),
  entertainment: Object.assign({}, defaultValue),
  general: Object.assign({}, defaultValue),
  health: Object.assign({}, defaultValue),
  science: Object.assign({}, defaultValue),
  sports: Object.assign({}, defaultValue),
  technology: Object.assign({}, defaultValue),
};

export function reducer(state = initialState, action: NewsActions): State {
  switch (action.type) {

    case NewsActionTypes.InitiateNews: {
      const copyCurrentState = Object.assign({}, state);
      const newsSection = action.payload;

      return {
        ...state,
        [newsSection]: {
          ...copyCurrentState[newsSection],
          retrieving: true
        }
      };
    }

    case NewsActionTypes.AddInitialApiArticles:
    case NewsActionTypes.AddInitialClientArticles:
    {
      const copyCurrentState = Object.assign({}, state);
      const newsSection = action.payload.newsSection;
      const result = action.payload.articles;
      const service = action.payload.service;
      const copyArticles = copyCurrentState[newsSection].articles.splice(0).concat(result);
      const clientFlag = (copyCurrentState[newsSection].clientDataLoaded)
        ? true
        :  service === Service.IndexedDb ? true : false;

      const pageUpdate = service === Service.NewsAPI
        ? copyCurrentState[newsSection].page + 1
        : copyCurrentState[newsSection].page;

      return {
        ...state,
        [newsSection]: {
          ...state[newsSection],
          articles: removeDuplicateTitles(copyArticles),
          page: pageUpdate,
          retrieving: false,
          firstLoadComplete: true,
          clientDataLoaded: clientFlag
        }
      };
    }

    case NewsActionTypes.InsertAdditionalNewsFromApi:
    {
      const copyCurrentState = Object.assign({}, state);
      const newsSection = action.payload.newsSection;
      const result = action.payload.articles;
      const service = action.payload.service;
      const copyArticles = copyCurrentState[newsSection].articles.splice(0).concat(result);
      const pageUpdate = copyCurrentState[newsSection].page + 1;
      return {
        ...state,
        [newsSection]: {
          ...state[newsSection],
          articles: removeDuplicateTitles(copyArticles),
          page: pageUpdate,
          retrieving: false,
          firstLoadComplete: true,
        }
      };
    }

    default:
      return state;
  }
}

export const getAllArticles = (state: State) => state;
