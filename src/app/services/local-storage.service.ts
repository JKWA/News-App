import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Filter } from '../models/filter';
import { NewsSection } from '../enums/news-section.enum';
import { ServiceMessageModel } from '../models/service-message.model';
import { LocalStorageGetMessage, LocalStorageSetMessage } from '../messages/service.messages';
import { stringToNewsSection } from '../shared/utility/news-section.utility';


@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  hasLocalStorage: boolean;
  constructor() {
    this.hasLocalStorage = (('localStorage' in window) && (localStorage !== undefined) && (localStorage !== null))
      ? true : false;
   }

  getSelectedNewsSections(): Observable<Set<NewsSection>> {
    if (this.hasLocalStorage) {
      const sections: string[] = JSON.parse(localStorage.getItem('newsSections'));
      if ( sections ) {
        const sectionSet: Set<NewsSection> = new Set();
        sections.map(section => {
          sectionSet.add(stringToNewsSection(section));
        });
        return of(sectionSet);
      }
    }
    return throwError(new LocalStorageGetMessage().errorMessage);
 }

  setSelectedNewsSections(categories: string[]): Observable<ServiceMessageModel> {
    if (this.hasLocalStorage) {
      categories.length
        ? localStorage.setItem('newsSections', JSON.stringify(categories))
        : localStorage.removeItem('newsSections');
      return of(new LocalStorageSetMessage().successMessage);
    }
    return throwError(new LocalStorageSetMessage().errorMessage);
  }


  getNewsSectionViewing(): Observable<NewsSection> {
    if (this.hasLocalStorage) {
      const currentlyViewed: string = localStorage.getItem('currentlyViewingNewsSection');
      if ( currentlyViewed ) {
        return of(stringToNewsSection(currentlyViewed));
      }
    }
    return throwError(new LocalStorageGetMessage().errorMessage);
 }



  setNewsSectionViewing(newsSection: NewsSection): Observable<ServiceMessageModel> {
    if (this.hasLocalStorage) {
      try {
        localStorage.setItem('currentlyViewingNewsSection', newsSection);
        return of(new LocalStorageSetMessage().successMessage);
      } catch (error) {
        return throwError(new LocalStorageSetMessage().errorMessage);
      }
    }
    return throwError(new LocalStorageSetMessage().errorMessage);
 }


  getFilters(): Observable<Set<Filter>> {
    if (this.hasLocalStorage) {
      try {
        const filterArray = JSON.parse(localStorage.getItem('filters'));
        console.log(filterArray);
        if ( filterArray ) {
          return of (new Set(filterArray));
        }
      } catch (error) {
        return throwError(new LocalStorageGetMessage().errorMessage);
      }
    }
    return throwError(new LocalStorageGetMessage().errorMessage);
 }


  setFilters(filters: Set<Filter>): Observable<ServiceMessageModel> {
    if (this.hasLocalStorage) {
      try {
        const deduplicated = new Set(Array.from(filters).map( filter => filter.toLowerCase().trim()));
        localStorage.setItem('filters', JSON.stringify(Array.from(deduplicated)));
        return of(new LocalStorageSetMessage().successMessage);
      } catch (error) {
        return throwError(new LocalStorageSetMessage().errorMessage);
      }
    }
    return throwError(new LocalStorageSetMessage().errorMessage);
 }
}
