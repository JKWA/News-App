import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CategoryState, SetCategory, CategoryStateModel } from '../state/state.category';
import { categoryToObject, stringToCategory } from '../category';
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
  @Select(CategoryState) categories: Observable<CategoryStateModel>;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.setCategories(this.categories);

    this.categories.subscribe( category => {

      // TODO check if iOS standalone and get state from store rather than route
      //      (window.matchMedia('(display-mode: standalone)').matches)
      //      @HostListener('window:offline', ['$event'])

      let found = {tabIndex: 0};  // default to 0

      if (this.route.snapshot.paramMap.get('id')) {
        found = this.tabs.find(tab => {
            return tab.id === this.route.snapshot.paramMap.get('id');
          });
      } else {
        found = this.tabs.find(tab => {
          return tab.id === category.setCategory;
        });
      }

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
    });

  }

  tabChanged(event) {
    const found = this.tabs.find(tab => tab.tabIndex === event);
    this.store.dispatch(new SetCategory(stringToCategory(found.id)));

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
