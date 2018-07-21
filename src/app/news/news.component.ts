import { Component, OnInit } from '@angular/core';
import { CategoryState, SetCategory, CategoryStateModel, categoryToObject, stringToCategory } from '../state/state.category';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

interface TabObject {
  display: string;
  id: string;
  tabIndex: number;
}

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})

export class NewsComponent implements OnInit {

  @Select(CategoryState) categories: Observable<CategoryStateModel>;
  tabs: TabObject[] = [];
  standalone = false;
  tabSelected = 0;

  constructor(
    private store: Store,

  ) { }

  ngOnInit() {
    let found;
    this.setCategories();

    // iOS standalone does not read route, need to save route state locally
    this.standalone = window.matchMedia('(display-mode: standalone)').matches;

    this.categories.subscribe( category => {
      found = this.tabs.find(tab => {
        return tab.id === category.setCategory;
      });
    }).unsubscribe();

    if ( !found ) { // default to first tab if problem
      found = {tabIndex: 0, id: 'general', display: 'General'};
    }

    this.tabSelected = found.tabIndex;
  }

  private setCategories() {
    this.categories.subscribe(result => {
      const tabs = [];

      let index = -1; // is this best?
      result.categories.forEach((category) => {
        index++;
        tabs.push({...categoryToObject(category), tabIndex: index });
      });
      this.tabs = Array.from(new Set(tabs));
    }).unsubscribe();
  }

  public tabChanged(event) {
    const found = this.tabs.find(tab => tab.tabIndex === event);
    this.store.dispatch(new SetCategory(stringToCategory(found.id)));
  }

}
