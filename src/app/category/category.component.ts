import { Component, OnInit } from '@angular/core';
import { AddCategory, RemoveCategory, CategoryState, Category, categoryToObject, CategoryObject } from '../state/state.category';
import { NewsStateModel, NewsState, AddNews } from '../state/state.news';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})

export class CategoryComponent implements OnInit {
    allCategories: CategoryItem[];
    @Select(NewsState) stateNews: Observable<NewsStateModel[]>;
    @Select(CategoryState) tabCategories: Observable<Set<Category>>;

    constructor(private store: Store) {
      this.allCategories = [
        CategoryMaker.create(Category.Business, 'Business', 'business'),
        CategoryMaker.create(Category.Entertainment, 'Entertainment', 'entertainment'),
        CategoryMaker.create(Category.General, 'General', 'general'),
        CategoryMaker.create(Category.Health, 'Health', 'health'),
        CategoryMaker.create(Category.Science, 'Science', 'science'),
        CategoryMaker.create(Category.Sports, 'Sports', 'sports'),
        CategoryMaker.create(Category.Technology, 'Technology', 'technology')
      ];
   }

  ngOnInit() {
    this.watchCat(this.tabCategories);
}

 /**
 * observe category state and set toggles
 * @param categories - set of categories enums
 */
  watchCat(categories) {
    categories.subscribe(result => {

      this.allCategories.map(category => {
        if ( result.categories.has(category.id)) {
          category.checked = true;
        } else {
          category.checked = false;
        }
      });
    });
  }


/**
 * watch category toggles and update category state
 * @param category - category string
 * @param checked - get checked from event
 */
  onClick(category: Category, {checked}) {

    if ( checked ) {
      this.store.dispatch(new AddCategory(category));
      this.store.dispatch(new AddNews(category, false));

    } else {
      this.store.dispatch(new RemoveCategory(category));
    }
  }

}

class CategoryItem {
  constructor(
    readonly category: Category,
    readonly display: string,
    readonly id: string,
    public checked: boolean,
  ) { }
}

class CategoryMaker {
  static create(
    category: Category,
    display: string,
    id: string,
  ) {
    return new CategoryItem(category, display, id, false);
  }
}

