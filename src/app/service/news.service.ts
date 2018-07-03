import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store, Select } from '@ngxs/store';
import { Category, stringToCategory } from '../category';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { getKey } from '../key';
import { Article } from '../article';
import { MessageService } from './message.service';
import { LocalDbService } from '../service/local-db.service';
import { Moment } from 'moment';

import { NewsResponse } from '../newsResponse';
import { getSources } from '../source';
import { Filter, FilterStateModel, FilterState } from '../state/state.filter';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private endpoint = 'https://newsapi.org/v2/everything';
  private country = 'us';
  private language = 'en';
  private pageSize = '25';
  private sort = 'publishedAt';

  constructor(
    private store: Store,
    private http: HttpClient,
    private messageService: MessageService,
    private localDb: LocalDbService,
  ) { }

  getNews (
    category: Category,
    pageNumber: number,
    filters: Set<Filter>,

   ): Observable<Article[]> {
    const sources: string = getSources(category).map(item => item.id).join();
    const filterString: string = '-' + Array.from(filters).join(',-');
    // const page = (this.pageNumber)
    let url = `${this.endpoint}?q=${filterString}`;
    url += `&sources=${sources}&language=${this.language}&sortBy=${this.sort}`;
    url += `&page=${pageNumber < 5 ? pageNumber : 2}&pageSize=${pageNumber < 5 ? this.pageSize : 100}&apiKey=${getKey()}`;
    console.log(url);
    const news = this.http.get<NewsResponse>(url)
      .pipe(
        map(response => {
          this.localDb.setData(stringToCategory(category), response.articles);
          return response.articles;
        }),
        tap(_ => this.log(`fetched ${category} news`)),
        catchError(this.handleError('getNews', []))
      );

      return news;
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      let userMessage: string;
      switch (error.status) {
        case 200 :
          break;
        case 400 :
          userMessage = 'There was a problem with the news request';
          break;

        case 401 :
          userMessage = 'This was an unauthorized request';
          break;

        case 429 :
          userMessage = 'We are over the limit, please try again later';
          break;

        case 500 :
          userMessage = 'There was a problem with the news server, please try again later';
          break;

        default :
        userMessage = 'Something broke';
      }
      if ( userMessage ) {
       this.log(userMessage);
      }

      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add('NewsService: ' + message);
  }
}
