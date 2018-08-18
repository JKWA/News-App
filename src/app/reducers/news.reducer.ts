import { Action } from '@ngrx/store';
import { NewsActions, NewsActionTypes } from '../actions/news.actions';
import { NewsCategory as NewsCategoryModel} from '../models/news-category.model';
import { removeDuplicateTitles } from '../utility/article.utility';
import { Service } from '../enums/service.enum';

export interface State {
  business: NewsCategoryModel;
  entertainment: NewsCategoryModel;
  general: NewsCategoryModel;
  health: NewsCategoryModel;
  science: NewsCategoryModel;
  sports: NewsCategoryModel;
  technology: NewsCategoryModel;
}

const defaultValue: NewsCategoryModel = {
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

    case NewsActionTypes.LoadNews:
      return state;

    case NewsActionTypes.InitiateNews: {
      const copyCurrentState = Object.assign({}, state);
      const category = action.payload;

      return {
        ...state,
        [category]: {
          ...copyCurrentState[category],
          retrieving: true
        }
      };
    }

    case NewsActionTypes.AddInitialArticles:
    case NewsActionTypes.AddInitialClientArticles:
    {
      const copyCurrentState = Object.assign({}, state);
      const category = action.payload.category;
      const result = action.payload.articles;
      const service = action.payload.service;
      const copyArticles = copyCurrentState[category].articles.splice(0).concat(result);
      const clientFlag = (copyCurrentState[category].clientDataLoaded)
        ? true
        :  service === Service.IndexedDb ? true : false;

      const pageUpdate = service === Service.NewsAPI
        ? copyCurrentState[category].page + 1
        : copyCurrentState[category].page;

      return {
        ...state,
        [category]: {
          ...state[category],
          articles: removeDuplicateTitles(copyArticles),
          page: pageUpdate,
          retrieving: false,
          firstLoadComplete: true,
          clientDataLoaded: clientFlag
        }
      };
    }

    default:
      return state;
  }
}

export const getAllArticles = (state: State) => state;
