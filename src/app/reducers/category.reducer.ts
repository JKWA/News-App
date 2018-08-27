import { CategoryActions, CategoryActionTypes } from '../actions/category.actions';
import { CategoryItemModel } from '../models/category-item.model';
import { Category } from '../enums/category.enum';
import { categoryToObject } from '../shared/utility/category.utility';

export interface State {
  setCategory: Category;
  allCategories: Map<string, CategoryItemModel>;
}

export const initialState: State = {
  setCategory: null,
  allCategories: new Map()
};

export function reducer(state = initialState, action: CategoryActions): State {
  switch (action.type) {

    case CategoryActionTypes.LoadCategories:
    case CategoryActionTypes.LoadCategoriesFailed: {
      return {
        ...state,
        allCategories: action.payload.allCategories,
        setCategory: action.payload.setCategory
      };
    }

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
      return {
        ...state,
        setCategory: action.payload
      };
    }

    default:
      return state;
  }
}
export const getAllCategories = (state: State) => state.allCategories;
export const getViewingCategory = (state: State) => state.setCategory;
