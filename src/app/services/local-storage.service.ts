import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Filter } from '../models/filter';
import { NewsSection } from '../enums/news-section.enum';
import { ServiceMessageModel } from '../models/service-message.model';
import { LocalStorageMessage } from '../messages/service.messages';
import { stringToNewsSections, stringToNewsSection } from '../shared/utility/news-section.utility';


@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  getSelectedNewsSections(): Observable<Set<NewsSection>> {
    return  new Observable(observer => {
    const localStorage = window.localStorage;

    if ( ! localStorage ) {
      return observer.error(new LocalStorageMessage().errorMessage);
    }
    return observer.next(new Set(stringToNewsSections(localStorage.getItem('newsSections'))));
  });
 }

  setSelectedNewsSections(categories: string[]): Observable<ServiceMessageModel> {
    return  new Observable(observer => {
      const localStorage = window.localStorage;

      if ( ! localStorage ) {
        return observer.error(new LocalStorageMessage().errorMessage);
      }

      categories.length
        ? localStorage.setItem('newsSections', categories.join())
        : localStorage.removeItem('newsSections');

      return observer.next(new LocalStorageMessage().successMessage);
    });
  }

  getNewsSectionViewing(): Observable<NewsSection> {
    return  new Observable(observer => {
     const localStorage = window.localStorage;
     if ( ! localStorage ) {
       return observer.error(new LocalStorageMessage().errorMessage);
     }
     return observer.next(stringToNewsSection(localStorage.getItem('currentlyViewingNewsSection')));
   });
 }

  setNewsSectionViewing(newsSection: NewsSection): Observable<ServiceMessageModel> {
    return  new Observable(observer => {
      const localStorage = window.localStorage;

      if ( ! localStorage ) {
        return observer.error(new LocalStorageMessage().errorMessage);
      }

      newsSection
        ? localStorage.setItem('currentlyViewingNewsSection', newsSection)
        : localStorage.removeItem('currentlyViewingNewsSection');
      return observer.next(new LocalStorageMessage().successMessage);
   });
 }

  getFilters(): Observable<Set<Filter>> {
    return  new Observable(observer => {
      const localStorage = window.localStorage;

      if ( ! localStorage ) {
        return observer.error(new LocalStorageMessage().errorMessage);
      }
      const filterString = localStorage.getItem('filters');
      const filters = filterString
        ? new Set (filterString.split(',').map(filter => filter.trim()))
        : new Set();
      return observer.next(filters);
    });
  }

  setFilters(filters: Set<Filter>): Observable<ServiceMessageModel> {
    return  new Observable(observer => {
      const localStorage = window.localStorage;

      if ( ! localStorage ) {
        return observer.error(new LocalStorageMessage().errorMessage);
      }
      localStorage.setItem('filters', Array.from(filters).join().toLowerCase());
      return observer.next(new LocalStorageMessage().successMessage);
   });
 }
}
