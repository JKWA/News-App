import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CategoryState } from '../state/state.category';
import { Category } from '../category';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  tabs = [];
  @Select(CategoryState) categories: Observable<Set<Category>>;
  constructor(private store: Store) {}

  ngOnInit() {
    this.setCategories(this.categories);
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
}


