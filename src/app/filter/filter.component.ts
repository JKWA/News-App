import { Component, OnInit } from '@angular/core';
import { AddFilter, RemoveFilter, Filter, FilterState } from '../state/state.filter';
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
 * observe input for enter key, then triggers to add filter
 * @param keyCode - keyCode from event object
 */
  watchForEnter({keyCode}) {
    if ( keyCode === 13 ) {
      this.addFilter();
    }
  }


/**
 * add filter to filter state
 */
  addFilter() {
    if ( this.newFilter ) {
      this.store.dispatch(new AddFilter(this.newFilter.toString()));
      this.newFilter = '';
    }
  }

/**
 * remove filter from filter state
 */
  removeFilter(item) {
    if ( item ) {
      this.store.dispatch(new RemoveFilter(item));
    }
  }

}
