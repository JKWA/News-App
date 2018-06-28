import { State, Action, StateContext } from '@ngxs/store';
import { Category } from './news';

export class AddCategory {
  static readonly type = 'Add';
  constructor(
    public categoryToAdd: Category
  ) {}
}

export interface CategoryStateModel {
  categories: Category[];
}

@State<CategoryStateModel>({
  name: 'category',
  defaults: {
    categories: (window.localStorage.getItem('categories'))
      ? convertToCategory(window.localStorage.getItem('categories'))
      : [
      Category.Science,
      Category.Technology
    ]
  }
})


export class CategoryState {
  @Action(AddCategory)
  add(ctx: StateContext<CategoryStateModel>, action: AddCategory) {
    console.log('test');
    const state = ctx.getState();
    ctx.setState({
      ...state,
      categories: Array.from(new Set([action.categoryToAdd].concat(state.categories))).slice(0, 3)
    });
  }
}

function convertToCategory(cat: string): Category[] {
  const categories = [];
  cat.split(',').map(category => {
    switch (category) {
      case 'business' :
        categories.push(Category.Business);
        break;
      case 'entertainment' :
        categories.push(Category.Entertainment);
        break;
      case 'general' :
        categories.push(Category.General);
        break;
      case 'health' :
        categories.push(Category.Health);
        break;
      case 'science' :
        categories.push(Category.Science);
        break;
      case 'sports' :
        categories.push(Category.Sports);
      break;
        case 'technology' :
        categories.push(Category.Technology);
        break;
      default :
      categories.push(Category.General);
    }
  });
  return categories;

}
