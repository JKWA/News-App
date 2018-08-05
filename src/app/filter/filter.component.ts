import { Component } from '@angular/core';
import { AddFilter, RemoveFilter, Filter, FilterState } from '../state/filter.state';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})

export class FilterComponent {
  newFilter: string;
  filterList: Set<Filter>;

  @Select(FilterState.allFilters) filters: Observable<Set<Filter>>;
  constructor(private store: Store)  { }

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
      this.store.dispatch(new AddFilter(this.newFilter.toString()));
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
      this.store.dispatch(new RemoveFilter(item));
    }
  }

}
