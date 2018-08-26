import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Filter } from '../models/filter';
import { Category } from '../enums/category.enum';
import { ServiceMessageModel } from '../models/service-message.model';
import { LocalStorageMessage } from '../messages/service.messages';
import { stringToCategories, stringToCategory } from '../shared/utility/category.utility';


@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  getSelectedCategories(): Observable<Set<Category>> {
    return  new Observable(observer => {
    const localStorage = window.localStorage;

    if ( ! localStorage ) {
      return observer.error(new LocalStorageMessage().errorMessage);
    }
    return observer.next(new Set(stringToCategories(localStorage.getItem('categories'))));
  });
 }

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

  getCategoryViewed(): Observable<Category> {
    return  new Observable(observer => {
     const localStorage = window.localStorage;
      console.log('HERE');
     if ( ! localStorage ) {
       return observer.error(new LocalStorageMessage().errorMessage);
     }
     return observer.next(stringToCategory(localStorage.getItem('setCategory')));
   });
 }

  setCategoryViewed(category: Category): Observable<ServiceMessageModel> {
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

  getFilters(): Observable<any> {
    return  new Observable(observer => {
      const localStorage = window.localStorage;

      if ( ! localStorage ) {
        return observer.error(new LocalStorageMessage().errorMessage);
      }
      return observer.next(localStorage.getItem('filters'));
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
