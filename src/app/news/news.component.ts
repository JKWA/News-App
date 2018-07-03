import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CategoryState } from '../state/state.category';
import { Category, CategoryObject, categoryToObject } from '../category';
import { ActivatedRoute} from '@angular/router';
// import {  } from '@angular/router';



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

  tabs: TabObject[] = [];
  tabSelected = 0;
  @Select(CategoryState) categories: Observable<Set<Category>>;
  constructor(
    private store: Store,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.setCategories(this.categories);

    console.log(this.route.snapshot.paramMap.get('id'));

    const found = this.tabs.find(tab => {
      return tab.id === this.route.snapshot.paramMap.get('id');
    });
    if (found) {
      this.tabSelected = found.tabIndex;
    }

  }

  tabChanged(event) {
    const found = this.tabs.find(tab => tab.tabIndex === event);

    if ( found ) {
      window.history.pushState('', found.display, `/news/${found.id}`);
    }
  }

  setCategories(categories) {
    categories.subscribe(result => {
      const tabs = [];

      let index = -1; // is this best?
      result.categories.forEach((category) => {
        index++;
        tabs.push({...categoryToObject(category), tabIndex: index });
      });
      this.tabs = Array.from(new Set(tabs));
    });
  }
}
