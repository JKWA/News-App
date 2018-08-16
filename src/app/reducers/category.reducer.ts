import { Action } from '@ngrx/store';
import { CategoryActions, CategoryActionTypes } from '../actions/category.actions';
import { CategoryItem, stringToCategory, createAllCategories } from '../utility/category.utility';
import { Category } from '../utility/category.enum';
import { categoryToObject } from '../utility/category.utility';


export interface State {
  setCategory: Category;
  allCategories: Map<string, CategoryItem>;
}

export const initialState: State = {
  setCategory: (window.localStorage.getItem('setCategory'))
    ? stringToCategory(window.localStorage.getItem('setCategory'))
    : Category.General,
  allCategories: createAllCategories()
};

export function reducer(state = initialState, action: CategoryActions): State {
  switch (action.type) {

    case CategoryActionTypes.LoadCategorys:
      return state;

    case CategoryActionTypes.AddCategory: {
      const categoryItem = categoryToObject(action.payload);
      const copy = new Map(state.allCategories);

      copy.set(categoryItem.id, Object.assign({}, copy.get(categoryItem.id), {selected: true}));

      return {
        ...state,
        allCategories: copy
      };
    }

    case CategoryActionTypes.AddGeneralCategory: {
      const copy = new Map(state.allCategories);
      copy.set('general', Object.assign({}, copy.get('general'), {selected: true}));
      return {
        ...state,
        allCategories: copy
      };
    }


    case CategoryActionTypes.RemoveCategory: {
      const categoryItem = categoryToObject(action.payload);
      const copy = new Map(state.allCategories);

      copy.set(categoryItem.id, Object.assign({}, copy.get(categoryItem.id), {selected: false}));

      return {
        ...state,
        allCategories: copy
      };
    }

    case CategoryActionTypes.SetCategory: {
      console.log(action.payload);
      return {
        ...state,
        setCategory: action.payload
      };
    }

    case CategoryActionTypes.SavedSelectedCategories: {
      return {
        ...state
      };
    }

    default:
      return state;
  }
}
export const getAllCategories = (state: State) => state.allCategories;
export const getViewingCategory = (state: State) => state.setCategory;
