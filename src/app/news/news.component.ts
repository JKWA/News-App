import { Component } from '@angular/core';
import { CategoryState, SetCategory } from '../state/category.state';
import { stringToCategory, CategoryItem } from '../category.function';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map, tap, withLatestFrom, take } from 'rxjs/operators';


@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})

export class NewsComponent {

  @Select(CategoryState.setCategory) setCategory: Observable<CategoryItem>;
  @Select(CategoryState.selectedCategories) categories: Observable<Set<CategoryItem>>;

  tabSelected = 0;

  constructor(
    private store: Store,
  ) { }



/**
 * Changes tab index in response to category selected
 *
 * @readonly
 * @type {Observable<number>}
 * @memberof NewsComponent
 */
get selectedIndex(): Observable<number> {
    return this.categories.pipe(
        withLatestFrom(this.setCategory),
        map(([categories, setCategory]) => {
          const find = Array.from(categories).find(cat => cat.id === setCategory.id);
          if (!find) {
            this.store.dispatch(new SetCategory(stringToCategory(Array.from(categories)[0].id)));
          }
          return find ? find.tabIndex : 0;
        })
    );
}


/**
 * tab changes are reflected to category state
 *
 * @param {*} event
 * @memberof NewsComponent
 */

public tabChanged(event): void {
    this.categories.pipe(
      take(1),
      map(results => {
        return Array.from(results).find( category => category.tabIndex === event).id;
        }),
      tap(results => this.store.dispatch(new SetCategory(stringToCategory(results))))
    ).subscribe();
  }

}
