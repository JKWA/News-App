import {Store, State, Action, StateContext, Selector } from '@ngxs/store';
import { UpdateState } from './log.state';
import { CategoryItem, stringToCategory, createAllCategories } from '../utility/category.utility';
import { Category } from '../utility/category.enum';


  /**
   * adds category to be displayed
   *
   * @export
   * @class AddCategory
   */
  export class AddCategory {
    static readonly type = '[Category Component] AddCategory';
    constructor(
      public categoryToAdd: CategoryItem
    ) {}
  }


/**
 * removes category to be displayed
 *
 * @export
 * @class RemoveCategory
 */
export class RemoveCategory {
  static readonly type = '[Category Component] RemoveCategory';
  constructor(
    public categoryToRemove: CategoryItem
  ) {}
}


/**
 * sets category to be displayed
 *
 * @export
 * @class SetCategory
 */
export class SetCategory {
  static readonly type = 'SetCategory';
  constructor(
    public categoryToSet: Category
  ) {}
}

export interface CategoryStateModel {
  setCategory: Category;
  allCategories: Map<string, CategoryItem>;
}

@State<CategoryStateModel>({
  name: 'category',
  defaults: {
    setCategory: (window.localStorage.getItem('setCategory'))
      ? stringToCategory(window.localStorage.getItem('setCategory'))
      : Category.General,
    allCategories: createAllCategories()
  }
})

export class CategoryState {

  @Selector() static setCategory(state: CategoryStateModel): CategoryItem {
    const categoryArray = Array.from(state.allCategories.values());
    const find = categoryArray.find(category => category.id === state.setCategory);
    return find ? find : categoryArray[0];
  }

/**
 * returns all categoryies
 *
 * @static
 * @param {CategoryStateModel} state
 * @returns {Set<CategoryItem>}
 * @memberof CategoryState
 */
@Selector() static allCategories(state: CategoryStateModel): Set<CategoryItem> {
    return new Set(Array.from(state.allCategories.values()));
  }

  @Selector() static selectedCategories(state: CategoryStateModel): Set<CategoryItem> {
    return new Set(
      Array.from(state.allCategories.values())
        .filter(category => category.selected)
        .map((item, tabIndex) => {
          item.tabIndex = tabIndex;
          return item;
        })
      );
  }

  constructor(
    private store: Store
  ) { }

/**
 * add category to be displayed in ui
 *
 * @param {StateContext<CategoryStateModel>} ctx
 * @param {AddCategory} action
 * @memberof CategoryState
 */
@Action( AddCategory)
  addCategory(ctx: StateContext<CategoryStateModel>, action: AddCategory) {
    const currentState = Object.assign({}, ctx.getState());

    const copy = new Map(ctx.getState().allCategories);
    copy.set(action.categoryToAdd.id, Object.assign({}, copy.get(action.categoryToAdd.id), {selected: true}));

    const allSelected: string[] = Array.from(copy.values()).filter(item => item.selected).map(item => item.id);
    window.localStorage.setItem('categories', Array.from(allSelected).join());

    ctx.patchState({
      allCategories: copy
    });

    // add to dev log
    this.store.dispatch(new UpdateState('Category', `adding ${action.categoryToAdd.display}`, currentState, ctx.getState()));

  }

/**
 * remove category to be displayed in ui
 *
 * @param {StateContext<CategoryStateModel>} ctx
 * @param {RemoveCategory} action
 * @memberof CategoryState
 */
@Action(RemoveCategory)
  removeCategory(ctx: StateContext<CategoryStateModel>, action: RemoveCategory) {
    const currentState = Object.assign({}, ctx.getState());

    const state = ctx.getState();
    const copy = new Map(state.allCategories);
    copy.set(action.categoryToRemove.id, Object.assign({}, copy.get(action.categoryToRemove.id), {selected: false}));


    const allSelected: string[] = Array.from(copy.values()).filter(item => item.selected).map(item => item.id);
    window.localStorage.setItem('categories', Array.from(allSelected).join());

    ctx.patchState({
      allCategories: copy
    });

     // add to dev log
    this.store.dispatch(new UpdateState('Category', `removing ${action.categoryToRemove.display}`, currentState, ctx.getState()));

  }
/**
 * view currently being shown in ui
 *
 * @param {StateContext<CategoryStateModel>} ctx
 * @param {SetCategory} action
 * @memberof CategoryState
 */
@Action( SetCategory )
  setCategoryItem(ctx: StateContext<CategoryStateModel>, action: SetCategory) {
    const currentState = Object.assign({}, ctx.getState());

    window.localStorage.setItem('setCategory', action.categoryToSet);

    ctx.patchState({
      setCategory: action.categoryToSet
    });

     // add to dev log
    this.store.dispatch(new UpdateState('Category', `changing view to ${action.categoryToSet}`, currentState, ctx.getState()));

  }

}






