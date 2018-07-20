import { Component, OnInit } from '@angular/core';
import { CategoryState, SetCategory, CategoryStateModel, categoryToObject, stringToCategory } from '../state/state.category';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AddNews, AddLocalNews } from '../state/state.news';

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
    private route: ActivatedRoute,
    private router: Router,

  ) { }

  ngOnInit() {
    let found;
    this.setInitialDataOnce();
    this.setCategories();
    console.log('news init');

    // iOS standalone does not read route, need to save route state locally
    this.standalone = window.matchMedia('(display-mode: standalone)').matches;

    // if ( this.standalone ) {
      // if standalone, get from category store (cached)
      this.categories.subscribe( category => {
        found = this.tabs.find(tab => {
          return tab.id === category.setCategory;
        });
      }).unsubscribe();

    // } else {

    //   found = this.tabs.find(tab => {
    //     return tab.id === this.route.snapshot.paramMap.get('id');
    //   });

    // }
    if ( !found ) { // default to first tab if problem
      found = {tabIndex: 0, id: 'general', display: 'General'};
    }

    // this.router.navigateByUrl(`/news/${found.id}`)
    //   .then( _ => {
        this.tabSelected = found.tabIndex;
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
  }

  private setInitialDataOnce() {
    this.categories.subscribe(result => {
      result.categories.forEach( category => {
        this.store.dispatch(new AddNews(category, false));
        // this.store.dispatch(new AddLocalNews(category));
      });
    }).unsubscribe();
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

    // perhaps better to only dispatch when standalone
    this.store.dispatch(new SetCategory(stringToCategory(found.id)));

    // if ( found ) {
    //   this.router.navigateByUrl(`/news/${found.id}`)
    //   .catch(error => {
    //     console.log(error);
    //   });
    // }
  }

}
