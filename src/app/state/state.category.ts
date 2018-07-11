import { State, Action, StateContext } from '@ngxs/store';
import {stringToCategories, stringToCategory, Category, categoryToObject} from '../category';

export class AddCategory {
  static readonly type = 'AddCategory';
  constructor(
    public categoryToAdd: Category
  ) {}
}

export class RemoveCategory {
  static readonly type = 'RemoveCategory';
  constructor(
    public categoryToRemove: Category
  ) {}
}

export class SetCategory {
  static readonly type = 'SetCategory';
  constructor(
    public categoryToSet: Category
  ) {}
}

export interface CategoryStateModel {
  categories: Set<Category>;
  setCategory: Category;
}

@State<CategoryStateModel>({
  name: 'category',
  defaults: {
    categories: (window.localStorage.getItem('categories'))
      ? stringToCategories(window.localStorage.getItem('categories'))
      : new Set([
        Category.General,
        Category.Science,
        Category.Technology
      ]),
    setCategory: (window.localStorage.getItem('setCategory'))
      ? stringToCategory(window.localStorage.getItem('setCategory'))
      : Category.General
  }
})

export class CategoryState {

  @Action( AddCategory)
  addCategory(ctx: StateContext<CategoryStateModel>, action: AddCategory) {
    // console.log('ADD: ' + action.categoryToAdd);
    const state = ctx.getState();
    state.categories.add(action.categoryToAdd);
    window.localStorage.setItem('categories', Array.from(state.categories).join());

    ctx.setState({
      ...state,
      categories: state.categories
    });
  }

  @Action(RemoveCategory)
  removeCategory(ctx: StateContext<CategoryStateModel>, action: RemoveCategory) {
    // console.log('DELETE: ' + action.categoryToRemove);

    const state = ctx.getState();
    state.categories.delete(action.categoryToRemove);
    window.localStorage.setItem('categories', Array.from(state.categories).join());

    ctx.setState({
      ...state,
      categories: state.categories
    });
  }

  @Action( SetCategory )
  setCategoryItem(ctx: StateContext<CategoryStateModel>, action: SetCategory) {
    // console.log('SET: ' + action.categoryToSet);
    const state = ctx.getState();
    window.localStorage.setItem('setCategory', action.categoryToSet);

    ctx.setState({
      ...state,
      setCategory: action.categoryToSet
    });
  }

}
