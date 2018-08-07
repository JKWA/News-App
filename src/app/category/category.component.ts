import { Component } from '@angular/core';
import { AddCategory, RemoveCategory, CategoryState } from '../state/category.state';
import { CategoryItem } from '../utility/category.utility';
import { InitialNews } from '../state/news.state';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})

export class CategoryComponent {

    @Select(CategoryState.allCategories) allCategories: Observable<Set<CategoryItem>>;

    constructor(private store: Store) { }


/**
 * changing values from the toggle button updates the category state
 *
 * @param {*} category
 * @param {*} {checked}
 * @memberof CategoryComponent
 */
onClick(category, {checked}): void {

    if ( checked ) {
      this.store.dispatch(new AddCategory(category));
      this.store.dispatch(new InitialNews(category.id));

    } else {
      this.store.dispatch(new RemoveCategory(category));
    }
  }

}
