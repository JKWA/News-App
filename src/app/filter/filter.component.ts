import { Component, OnInit } from '@angular/core';
import { AddFilter, RemoveFilter, Filter, FilterState } from '../state/state.filter';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})

export class FilterComponent implements OnInit {
  newFilter: string;
  filterList: Set<Filter>;

  @Select(FilterState) listOfFilters: Observable<Set<Filter>>;
  constructor(private store: Store)  { }


  ngOnInit() {
    this.setFilters(this.listOfFilters);
  }

/**
 * observe input for enter key, then triggers to add filter
 * @param keyCode - keyCode from event object
 */
  watchForEnter({keyCode}) {
    if ( keyCode === 13 ) {
      this.addFilter();
    }
  }

  // TODO update this to sync on template
/**
 * observe filters from filter state and show on template
 * @param filters - observable filters from filter state
 */
  setFilters(filters) {
    filters.subscribe(result => {
      this.filterList = result.listOfFilters;
    });
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
