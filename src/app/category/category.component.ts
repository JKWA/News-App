import { Component, OnInit } from '@angular/core';
import { Category } from '../news';
import { AddCategory, CategoryState } from '../app.state';
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

    @Select(CategoryState) tabCategories: Observable<Category[]>;

    constructor(private store: Store) {
      this.allCategories = [
        CategoryMaker.create(Category.Business, 'Business'),
        CategoryMaker.create(Category.Entertainment, 'Entertainment'),
        CategoryMaker.create(Category.General, 'General'),
        CategoryMaker.create(Category.Health, 'Health'),
        CategoryMaker.create(Category.Science, 'Science'),
        CategoryMaker.create(Category.Sports, 'Sports'),
        CategoryMaker.create(Category.Technology, 'Technology'),
      ];
   }

  ngOnInit() {
    this.setCategories(this.tabCategories);

  }

  setCategories(categories) {
    categories.subscribe(result => {
      window.localStorage.setItem('categories', result.categories);
      const tabs = [];
      result.categories.map(category => {
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

  onClick(category: Category) {
    console.log(category);
    this.store.dispatch(new AddCategory(category));
  }

}

class CategoryItem {
  constructor(
    readonly category: Category,
    readonly display: string
  ) { }
}

class CategoryMaker {
  static create(
    category: Category,
    display: string
  ) {
    return new CategoryItem(category, display);
  }
}

