import {Store, State, Action, StateContext, Selector } from '@ngxs/store';
import { AddLog } from './state.log';

export enum Category {
    Business = 'business',
    Entertainment = 'entertainment',
    General = 'general',
    Health = 'health',
    Science = 'science',
    Sports = 'sports',
    Technology = 'technology',
}

export function stringToCategory(cat: string): Category {
  let returnCat;

    switch (cat) {
      case 'business' :
        returnCat = Category.Business;
        break;
      case 'entertainment' :
        returnCat = Category.Entertainment;
        break;
      case 'general' :
        returnCat = Category.General;
        break;
      case 'health' :
        returnCat = Category.Health;
        break;
      case 'science' :
        returnCat = Category.Science;
        break;
      case 'sports' :
        returnCat = Category.Sports;
      break;
        case 'technology' :
        returnCat = Category.Technology;
        break;
      default :
      returnCat = Category.General;
    }

  return returnCat;

}

export function stringToCategories(cat: string): Set<Category> {
    const categorySet = new Set();
    cat.split(',').map(category => {
      switch (category) {
        case 'business' :
          categorySet.add(Category.Business);
          break;
        case 'entertainment' :
          categorySet.add(Category.Entertainment);
          break;
        case 'general' :
          categorySet.add(Category.General);
          break;
        case 'health' :
          categorySet.add(Category.Health);
          break;
        case 'science' :
          categorySet.add(Category.Science);
          break;
        case 'sports' :
          categorySet.add(Category.Sports);
        break;
          case 'technology' :
          categorySet.add(Category.Technology);
          break;
        default :
        categorySet.add(Category.General);
      }
    });
    return categorySet;

  }

  export interface CategoryObject {
    display: string;
    id: string;
  }

  export function categoryToObject(category: Category): CategoryObject {
    let catObj;
    switch (category) {
      case Category.Science :
        catObj = {
          display: 'Science',
          id: 'science'
        };
        break;
        case Category.Business :
          catObj = {
            display: 'Business',
            id: 'business'
          };
          break;
        case Category.Entertainment :
        catObj = {
          display: 'Entertainment',
          id: 'entertainment'
        };
        break;
        case Category.General :
        catObj = {
          display: 'General',
          id: 'general'
        };
        break;
        case Category.Health :
        catObj = {
          display: 'Health',
          id: 'health'
        };
        break;
      case Category.Science :
        catObj = {
          display: 'Science',
          id: 'science'
        };
        break;
      case Category.Sports :
        catObj = {
          display: 'Sports',
          id: 'sports'
        };
        break;
      case Category.Technology :
        catObj = {
          display: 'Technology',
          id: 'technology'
        };
        break;
      default :
      catObj = {
        display: 'Other',
        id: 'general'
      };
    }
    return catObj;
  }



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

  @Selector() static setCategory(state: CategoryStateModel): Category {
    return stringToCategory(state.setCategory);
  }

  constructor(
    private store: Store
  ) { }

  @Action( AddCategory)
  addCategory(ctx: StateContext<CategoryStateModel>, action: AddCategory) {
    const state = ctx.getState();
    state.categories.add(action.categoryToAdd);
    window.localStorage.setItem('categories', Array.from(state.categories).join());

    ctx.setState({
      ...state,
      categories: state.categories
    });
    this.store.dispatch(new AddLog('Category: ', `added ${action.categoryToAdd}`));
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
    this.store.dispatch(new AddLog('Category: ', `removed ${action.categoryToRemove}`));
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
    this.store.dispatch(new AddLog('Category: ', `viewing ${action.categoryToSet}`));

  }

}






