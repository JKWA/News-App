import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import * as FilterActions from './../../actions/filter.actions';
import { Store, select } from '@ngrx/store';
import * as fromFilter from './../../reducers';
import { Filter } from '../../models/filter';


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})

export class FilterComponent {
  newFilter: string;

  constructor(private store: Store<fromFilter.State>)  { }

  get getAllFilters(): Observable<Set<Filter>> {
    return this.store.pipe(
      select(fromFilter.getAllFilters),
    );
  }

  /**
 * observe key input and trigger addFilter() when "ENTER"
 *
 * @param {*} {keyCode}
 * @memberof FilterComponent
 */
watchForEnter({keyCode}): void {
    if ( keyCode === 13 ) {
      this.addFilter();
    }
  }


/**
 * add filter to filter state
 *
 * @memberof FilterComponent
 */
addFilter(): void {
    if ( this.newFilter ) {
      this.store.dispatch(new FilterActions.AddFilter(this.newFilter.toString()));
      this.newFilter = '';
    }
  }


/**
 * remove filter from filter state
 *
 * @param {*} item
 * @memberof FilterComponent
 */
removeFilter(item): void {
    if ( item ) {
      this.store.dispatch(new FilterActions.RemoveFilter(item));

    }
  }

}
