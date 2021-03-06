import { NewsSectionActions, NewsSectionActionTypes } from '../actions/news-section.actions';
import { NewsSectionModel } from '../models/news-section.model';
import { NewsSection } from '../enums/news-section.enum';

export interface State {
  currentlyViewingNewsSection: NewsSection;
  allNewsSections: Map<string, NewsSectionModel>;
}

export const initialState: State = {
  currentlyViewingNewsSection: null,
  allNewsSections: new Map()
};

export function reducer(state = initialState, action: NewsSectionActions): State {
  switch (action.type) {

    // case NewsSectionActionTypes.LoadNewsSections:
    // case NewsSectionActionTypes.LoadNewsSectionsFailed: {
    //   return {
    //     ...state,
    //     allNewsSections: action.payload.allNewsSections,
    //     currentlyViewingNewsSection: action.payload.currentlyViewingNewsSection
    //   };
    // }

    case NewsSectionActionTypes.LoadAllNewsSections:
    case NewsSectionActionTypes.LoadAllNewsSectionsDefault: {
      return {
        ...state,
        allNewsSections: action.payload,
      };
    }

    case NewsSectionActionTypes.AddNewsSection: {
      const copy = new Map(state.allNewsSections);
      copy.set(action.payload, Object.assign({}, copy.get(action.payload), {selected: true}));

      return {
        ...state,
        allNewsSections: copy
      };
    }

    case NewsSectionActionTypes.AddGeneralNewsSection: {
      const copy = new Map(state.allNewsSections);
      copy.set('general', Object.assign({}, copy.get('general'), {selected: true}));
      return {
        ...state,
        allNewsSections: copy
      };
    }

    case NewsSectionActionTypes.RemoveNewsSection: {
      const copy = new Map(state.allNewsSections);
      copy.set(action.payload, Object.assign({}, copy.get(action.payload), {selected: false}));

      return {
        ...state,
        allNewsSections: copy
      };
    }

    case NewsSectionActionTypes.LoadCurrentlyViewingNewsSection:
    case NewsSectionActionTypes.LoadCurrentlyViewingNewsSectionDefault:
    case NewsSectionActionTypes.SetCurrentlyViewingNewsSection: {
      return {
        ...state,
        currentlyViewingNewsSection: action.payload
      };
    }

    default:
      return state;
  }
}
export const getAllNewsSections = (state: State) => state.allNewsSections;
export const getViewingNewsSection = (state: State) => state.currentlyViewingNewsSection;
