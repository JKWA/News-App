import { reducer, initialState, State} from './category.reducer';
import * as CategoryActions from '../actions/category.actions';
import { Category } from '../enums/category.enum';
import { createAllCategories } from '../shared/utility/category.utility';

describe('Category Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
  describe('SetCategory: Category actions', () => {
    const allCategories = createAllCategories();
    it('should change the category being viewed', () => {
      const firstState: State = {
        setCategory: Category.General,
        allCategories
    };
      const action = new CategoryActions.SetCategory(Category.Sports);
      const expectedResult: State = {
        setCategory: Category.Sports,
        allCategories
      };

      const result = reducer(firstState, action);
      expect(result).toEqual(expectedResult);
    });

    it('AddCategory: should add a selected category', () => {
      const firstState: State = {
        setCategory: Category.General,
        allCategories
    };
      const action = new CategoryActions.AddCategory(Category.Sports);
      const copy = new Map(allCategories);
      copy.set(Category.Sports, Object.assign({}, copy.get(Category.Sports), {selected: true}));
      const expectedResult: State = {
        setCategory: Category.General,
        allCategories: copy
      };

      const result = reducer(firstState, action);
      expect(result).toEqual(expectedResult);
    });

    it('RemoveCategory: should remove a selected category', () => {
      const firstState: State = {
        setCategory: Category.General,
        allCategories
    };
      const action = new CategoryActions.RemoveCategory(Category.General);
      const copy = new Map(allCategories);
      copy.set(Category.General, Object.assign({}, copy.get(Category.General), {selected: false}));
      const expectedResult: State = {
        setCategory: Category.General,
        allCategories: copy
      };

      const result = reducer(firstState, action);
      expect(result).toEqual(expectedResult);
    });

    it('AddGeneralCategory: should change General.selected to true', () => {
      const noShowed = new Map();
      allCategories.forEach((value, key) => {
        noShowed.set(key, {...value, selected: false} );
      });

      const firstState: State = {
        setCategory: Category.General,
        allCategories: noShowed
    };
      const action = new CategoryActions.AddGeneralCategory();
      const copy = new Map(noShowed);
      copy.set(Category.General, Object.assign({}, copy.get(Category.General), {selected: true}));

      const expectedResult: State = {
        setCategory: Category.General,
        allCategories: copy
      };

      const result = reducer(firstState, action);
      expect(result).toEqual(expectedResult);
    });

  });
});
