import { Component, OnInit } from '@angular/core';
import { CategoryState, SetCategory } from '../state/state.category';
import { stringToCategory, CategoryItem } from '../category.function';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})

export class NewsComponent implements OnInit {

  @Select(CategoryState.setCategory) setCategory: Observable<CategoryItem>;
  @Select(CategoryState.selectedCategories) categories: Observable<Set<CategoryItem>>;

  tabSelected = 0;

  constructor(
    private store: Store,
  ) { }

  ngOnInit() {
    this.setLastStateOfCategoryViewed();
  }

  /**
   * observes tab categories and selected category and sets tab index
   */
  setLastStateOfCategoryViewed(): void {
    let found;
    this.setCategory.subscribe(category => {
      this.categories.subscribe( categories => {
        found = Array.from(categories).find( cat => cat.id === category.id);
      }).unsubscribe();
    }).unsubscribe();
    if (found) {
      this.tabSelected = found.tabIndex;
    }
  }


/**
 * watch when tab changes and reflect to category state
 * @param event - the event from template
 */
  public tabChanged(event) {
    let found;
    this.categories.subscribe( categories => {
      found = Array.from(categories).find( category => category.tabIndex === event);
    }).unsubscribe();

    if ( found ) {
      this.store.dispatch(new SetCategory(stringToCategory(found.id)));
    }
  }

}
