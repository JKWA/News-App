import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Filter } from '../models/filter';
import { Category } from '../enums/category.enum';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setSelectedCategories(categories: string[]): Observable<any> {

     return  new Observable(observer => {
      const localStorage = window.localStorage;

      if ( ! localStorage ) {
        return observer.error({
          status: 2100,
          statusText: 'No local storage available'
        });
      }

      categories.length
        ? localStorage.setItem('categories', categories.join())
        : localStorage.removeItem('categories');

      return observer.next({
        status: 2000,
        statusText: `Saved ${categories} to local storage`
      });
    });
  }

  setCategoryViewed(category: Category): Observable<any> {

    return  new Observable(observer => {
     const localStorage = window.localStorage;

     if ( ! localStorage ) {
       return observer.error({
         status: 2100,
         statusText: 'No local storage available'
       });
     }

     category
       ? localStorage.setItem('setCategory', category)
       : localStorage.removeItem('setCategory');

     return observer.next({
       status: 2000,
       statusText: `Saved viewed category ${category} to local storage`
     });
   });
 }

  setFilters(filters: Set<Filter>): Observable<any> {

    return  new Observable(observer => {
     const localStorage = window.localStorage;

     if ( ! localStorage ) {
       return observer.error({
         status: 2100,
         statusText: 'No local storage available'
       });
     }

     filters.size
       ? localStorage.setItem('filters', Array.from(filters).join().toLowerCase())
       : localStorage.setItem('filters', '$NONE$');

     return observer.next({
       status: 2000,
       statusText: `Saved filters ${Array.from(filters).join().toLowerCase()} to local storage`
     });
   });
 }
}
