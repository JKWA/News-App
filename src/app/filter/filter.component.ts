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

  setFilters(filters) {
    filters.subscribe(result => {
      this.filterList = result.listOfFilters;
    });
  }

  addFilter() {
    if ( this.newFilter ) {
      this.store.dispatch(new AddFilter(this.newFilter.toString()));
    }
  }

  removeFilter(item) {
    if ( item ) {
      this.store.dispatch(new RemoveFilter(item));
    }
  }

}
