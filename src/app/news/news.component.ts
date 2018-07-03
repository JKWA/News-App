import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CategoryState } from '../state/state.category';
import { Category, CategoryObject, categoryToObject } from '../category';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  tabs: CategoryObject[] = [];
  @Select(CategoryState) categories: Observable<Set<Category>>;
  constructor(private store: Store) {}

  ngOnInit() {
    this.setCategories(this.categories);
  }

  setCategories(categories) {
    categories.subscribe(result => {
      const tabs = [];
      result.categories.forEach(category => {
        tabs.push(categoryToObject(category));
      });
      this.tabs = Array.from(new Set(tabs));
    });
  }
}
