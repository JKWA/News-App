import { Component } from '@angular/core';
import { stringToCategory, CategoryItem } from '../utility/category.utility';
import * as CategoryActions from './../actions/category.actions';
import { Observable, of } from 'rxjs';
import { map, tap, withLatestFrom, catchError } from 'rxjs/operators';
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

  get getViewingCategory() {
    return this.store.pipe(select(fromCategory.getViewingCategory));
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


get selectedIndex(): Observable<number> {

    return this.getSelectedCategories.pipe(
        withLatestFrom(this.getViewingCategory),
        map(([categories, setCategory]) => {
          const catArray = Array.from(categories);
          const find = catArray.find(cat => cat.id === setCategory);
          if (!find) {
            this.store.dispatch(new CategoryActions.SetCategory(stringToCategory(catArray[0].id)));
          }
          return find ? catArray.indexOf(find) : 0;
        }),
        catchError(_ =>  of(0))
    );
}


/**
 * tab changes are reflected to category state
 *
 * @param {*} event
 * @memberof NewsComponent
 */
public tabChanged(event): void {

  this.store.pipe(
    select(fromCategory.getAllCategories),
    map(results => Array.from(results.values()).filter(result => result.selected)[event]),
    tap(result => this.store.dispatch(new CategoryActions.SetCategory(stringToCategory(result.id))))
  ).subscribe();
  }

}
