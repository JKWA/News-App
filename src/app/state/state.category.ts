import { State, Action, StateContext } from '@ngxs/store';
// import { join } from 'path';
import { forEach } from '@angular/router/src/utils/collection';
import {stringToCategories, Category} from '../category';

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

export interface CategoryStateModel {
  categories: Set<Category>;
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
      ])
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

}
