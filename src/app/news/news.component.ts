import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CategoryState } from '../state/state.category';
import { Category, CategoryObject, categoryToObject } from '../category';
import { ActivatedRoute, Router } from '@angular/router';


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
    private router: Router,
  ) {}

  ngOnInit() {
    this.setCategories(this.categories);

    const found = this.tabs.find(tab => {
      return tab.id === this.route.snapshot.paramMap.get('id');
    });
    if (found) {
      this.tabSelected = found.tabIndex;
    } else {
      this.router.navigateByUrl(`/news/${this.tabs[0].id}`)
      .then(item => {
        // console.log(item);
      })
      .catch(error => {
        console.log(error);
      });
    }

  }

  tabChanged(event) {
    const found = this.tabs.find(tab => tab.tabIndex === event);

    if ( found ) {
      this.router.navigateByUrl(`/news/${found.id}`)
      .then(item => {
        // if successful change
        // console.log(item);
      })
      .catch(error => {
        console.log(error);
      });
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
