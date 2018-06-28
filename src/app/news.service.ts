

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { getKey } from './key';
import { Article } from './article';
import { MessageService } from './message.service';
import { NewsResponse } from './newsResponse';




@Injectable({ providedIn: 'root' })
export class NewsService {
  private endpoint = 'https://newsapi.org/v2/top-headlines';
  private topic = '-trump';
  private country = 'us';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getNews ( category: string ): Observable<Article[]> {
    const url = `${this.endpoint}?category=${category}&country=${this.country}&apiKey=${getKey()}`;

    return this.http.get<NewsResponse>(url)
      .pipe(
        map(response => {
         return response.articles;
        }),
        tap(_ => this.log(`fetched ${category} news`)),
        catchError(this.handleError('getNews', []))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }
}
