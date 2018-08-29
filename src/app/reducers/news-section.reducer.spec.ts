import { reducer, initialState, State} from './news-section.reducer';
import * as NewsSectionActions from '../actions/news-section.actions';
import { NewsSection } from '../enums/news-section.enum';
// import { createallNewsSections } from '../shared/utility/newsSection.utility';
import { NewsSectionDefault } from '../shared/defaults/news-section.default';

describe('NewsSection Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('SetCurrentlyViewingNewsSection: NewsSection actions', () => {
    const allNewsSections = new NewsSectionDefault().createAllNewsSections;
    it('should change the newsSection being viewed', () => {
      const firstState: State = {
        currentlyViewingNewsSection: NewsSection.General,
        allNewsSections
    };
      const action = new NewsSectionActions.SetCurrentlyViewingNewsSection(NewsSection.Sports);
      const expectedResult: State = {
        currentlyViewingNewsSection: NewsSection.Sports,
        allNewsSections
      };

      const result = reducer(firstState, action);
      expect(result).toEqual(expectedResult);
    });

    it('AddNewsSection: should add a selected newsSection', () => {
      const firstState: State = {
        currentlyViewingNewsSection: NewsSection.General,
        allNewsSections
    };
      const action = new NewsSectionActions.AddNewsSection(NewsSection.Sports);
      const copy = new Map(allNewsSections);
      copy.set(NewsSection.Sports, Object.assign({}, copy.get(NewsSection.Sports), {selected: true}));
      const expectedResult: State = {
        currentlyViewingNewsSection: NewsSection.General,
        allNewsSections: copy
      };

      const result = reducer(firstState, action);
      expect(result).toEqual(expectedResult);
    });

    it('RemoveNewsSection: should remove a selected newsSection', () => {
      const firstState: State = {
        currentlyViewingNewsSection: NewsSection.General,
        allNewsSections
    };
      const action = new NewsSectionActions.RemoveNewsSection(NewsSection.General);
      const copy = new Map(allNewsSections);
      copy.set(NewsSection.General, Object.assign({}, copy.get(NewsSection.General), {selected: false}));
      const expectedResult: State = {
        currentlyViewingNewsSection: NewsSection.General,
        allNewsSections: copy
      };

      const result = reducer(firstState, action);
      expect(result).toEqual(expectedResult);
    });

    it('AddGeneralNewsSection: should change General.selected to true', () => {
      const noShowed = new Map();
      allNewsSections.forEach((value, key) => {
        noShowed.set(key, {...value, selected: false} );
      });

      const firstState: State = {
        currentlyViewingNewsSection: NewsSection.General,
        allNewsSections: noShowed
    };
      const action = new NewsSectionActions.AddGeneralNewsSection();
      const copy = new Map(noShowed);
      copy.set(NewsSection.General, Object.assign({}, copy.get(NewsSection.General), {selected: true}));

      const expectedResult: State = {
        currentlyViewingNewsSection: NewsSection.General,
        allNewsSections: copy
      };

      const result = reducer(firstState, action);
      expect(result).toEqual(expectedResult);
    });

  });
});
