import { Component, OnInit } from '@angular/core';
import { Category } from '../category';
import { AddCategory, RemoveCategory, CategoryState } from '../state/state.category';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})

export class CategoryComponent implements OnInit {
    allCategories: CategoryItem[];
    tabs = [];

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
    this.setCategories(this.tabCategories);
    this.watchCat(this.tabCategories);
  }

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

  setCategories(categories) {
    categories.subscribe(result => {
      const tabs = [];
      result.categories.forEach(category => {
        let tabItem: any;
        switch (category) {
          case Category.Science :
            tabItem = {
              display: 'Science',
              id: 'science'
            };
            break;
            case Category.Business :
              tabItem = {
                display: 'Business',
                id: 'business'
              };
              break;
            case Category.Entertainment :
            tabItem = {
              display: 'Entertainment',
              id: 'entertainment'
            };
            break;
            case Category.General :
            tabItem = {
              display: 'General',
              id: 'general'
            };
            break;
            case Category.Health :
            tabItem = {
              display: 'Health',
              id: 'health'
            };
            break;
          case Category.Science :
            tabItem = {
              display: 'Science',
              id: 'science'
            };
            break;
          case Category.Sports :
            tabItem = {
              display: 'Sports',
              id: 'sports'
            };
            break;
          case Category.Technology :
            tabItem = {
              display: 'Technology',
              id: 'technology'
            };
            break;
          default :
          tabItem = {
            display: 'Other',
            id: 'general'
          };
        }
        tabs.push(tabItem);
      });
      this.tabs = Array.from(new Set(tabs));
    });
  }

  onClick(category: Category, {checked}) {

    if ( checked ) {
      this.store.dispatch(new AddCategory(category));
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

