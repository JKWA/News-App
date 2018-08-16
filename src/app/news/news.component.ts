import { Component } from '@angular/core';
import { CategoryState, SetCategory } from '../state/category.state';
import { stringToCategory, CategoryItem } from '../utility/category.utility';
// import { Store, Select } from '@ngxs/store';
import * as CategoryActions from './../actions/category.actions';

import { Observable, of } from 'rxjs';
import { map, tap, withLatestFrom, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import * as fromCategory from './../reducers';



@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})

export class NewsComponent {

  tabSelected = 0;

  constructor(private store: Store<fromCategory.State>) {}


/**
 * Changes tab index in response to category selected
 *
 * @readonly
 * @type {Observable<number>}
 * @memberof NewsComponent
 */
get selectedIndex(): Observable<number> {

  const getViewingCategory = this.store.pipe(select(fromCategory.getViewingCategory));

    return this.store.pipe(
        select(fromCategory.getAllCategories),
        withLatestFrom(getViewingCategory),
        map(([categories, setCategory]) => {
          const find = Array.from(categories.values()).find(cat => cat.id === setCategory);
          if (!find) {
            this.store.dispatch(new CategoryActions.SetCategory(stringToCategory(this.getSelectedCategories[0].id)));
          }
          return find ? find.tabIndex : 0;
        })
    );
}


/**
 *
 *
 * @readonly
 * @type {Observable<Set<CategoryItem>>}
 * @memberof NewsComponent
 */
get getSelectedCategories(): Observable<CategoryItem[]> {
  return this.store.pipe(
    select(fromCategory.getAllCategories),
    map(results => Array.from(results.values()).filter(result => result.selected))
  );
}


/**
 * tab changes are reflected to category state
 *
 * @param {*} event
 * @memberof NewsComponent
 */
public tabChanged(event): void {
console.log(event);
  this.store.pipe(
    select(fromCategory.getAllCategories),
    map(results => Array.from(results.values()).filter(result => result.selected)[event]),
    tap(console.log),
    tap(result => this.store.dispatch(new CategoryActions.SetCategory(stringToCategory(result.id))))
  ).subscribe();
  }

}
