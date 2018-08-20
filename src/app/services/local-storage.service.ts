import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Filter } from '../models/filter';
import { Category } from '../enums/category.enum';
import { ServiceMessageModel } from '../models/service-message.model';
import { LocalStorageMessage } from '../messages/service.messages';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setSelectedCategories(categories: string[]): Observable<ServiceMessageModel> {

     return  new Observable(observer => {
      const localStorage = window.localStorage;

      if ( ! localStorage ) {
        return observer.error(new LocalStorageMessage().errorMessage);
      }

      categories.length
        ? localStorage.setItem('categories', categories.join())
        : localStorage.removeItem('categories');

      return observer.next(new LocalStorageMessage().successMessage);
    });
  }

  setCategoryViewed(category: Category): Observable<any> {

    return  new Observable(observer => {
      const localStorage = window.localStorage;

      if ( ! localStorage ) {
        return observer.error(new LocalStorageMessage().errorMessage);
      }

      category
        ? localStorage.setItem('setCategory', category)
        : localStorage.removeItem('setCategory');
      return observer.next(new LocalStorageMessage().successMessage);
   });
 }

  setFilters(filters: Set<Filter>): Observable<ServiceMessageModel> {

    return  new Observable(observer => {
      const localStorage = window.localStorage;

      if ( ! localStorage ) {
        return observer.error(new LocalStorageMessage().errorMessage);
      }

      filters.size
        ? localStorage.setItem('filters', Array.from(filters).join().toLowerCase())
        : localStorage.setItem('filters', '$NONE$');

      return observer.next(new LocalStorageMessage().successMessage);
   });
 }
}
