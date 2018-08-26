import { Component } from '@angular/core';
import { CategoryItem } from '../../shared/utility/category.utility';
import * as CategoryActions from './../../actions/category.actions';
import { stringToCategory } from '../../shared/utility/category.utility';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as fromCategory from './../../reducers';
import { tap, map } from 'rxjs/operators';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})

export class CategoryComponent {

    constructor(private store: Store<fromCategory.State>) {}

    get getAllCategories(): Observable<Set<CategoryItem>> {
      return this.store.pipe(
        select(fromCategory.getAllCategories),
        map(results => new Set(Array.from(results.values())))
      );
    }


/**
 * changing values from the toggle button updates the category state
 *
 * @param {*} category
 * @param {*} {checked}
 * @memberof CategoryComponent
 */
onClick(category, {checked}): void {

    if ( checked ) {
      this.store.dispatch(new CategoryActions.AddCategory(stringToCategory(category.id)));
      // this.store.dispatch(new InitialNews(category.id));

    } else {
      this.store.dispatch(new CategoryActions.RemoveCategory(stringToCategory(category.id)));

    }
  }

}
