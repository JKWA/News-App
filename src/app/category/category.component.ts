import { Component } from '@angular/core';
import { AddCategory, RemoveCategory, CategoryState } from '../state/state.category';
import { CategoryItem } from '../category.function';
import { AddNews } from '../state/state.news';
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
 * category toggles update category state
 * @param category - category string
 * @param selected - get selected from event
 */
  onClick(category, {checked}) {

    if ( checked ) {
      this.store.dispatch(new AddCategory(category));
      this.store.dispatch(new AddNews(category.id, false));

    } else {
      this.store.dispatch(new RemoveCategory(category));
    }
  }

}
