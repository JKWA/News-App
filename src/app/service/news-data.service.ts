import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { AddMessage, AddError } from '../state/state.log';
import { Article } from '../article';
import { getKey } from '../key';
import { getSources } from '../source';
import { stringToCategory} from '../category.function';

class NewsResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}


@Injectable({
  providedIn: 'root'
})
export class NewsDataService {
  private endpoint = 'https://newsapi.org/v2/everything';
  // private country = 'us';
  private language = 'en';
  private pageSize = '25';
  private sort = 'publishedAt';

  constructor (
    private http: HttpClient,
    private store: Store
  ) { }

  getNews (category: string, pageNumber: number, filters) {
    const sources: string = getSources(stringToCategory(category)).map(item => item.id).join();

      let url = `${this.endpoint}?`;

      if (filters.size) {
        const filterString = `"-${Array.from(filters).join('",-"')}"`;
        url += `q=${encodeURIComponent(filterString)}&`;
      }

      url += `sources=${sources}&language=${this.language}&sortBy=${this.sort}`;
      url += `&page=${pageNumber < 5 ? pageNumber : 2}&pageSize=${pageNumber < 5 ? this.pageSize : 100}&apiKey=${getKey()}`;

    return this.http.get<NewsResponse>(url)
      .pipe(
        map(response => {
          return response.articles;
        }),
        map(result => {
          return result.map(article => {
              article.anchorText = encodeURIComponent(article.title);
              const expression = /https:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
              const regex = new RegExp(expression);
              if ( article.urlToImage ) {
              if ( ! article.urlToImage.match(regex) ) {
                 article.urlToImage = null;
              }
            }
              return article;
          });
        }),
        tap(_ => this.log(`received ${category} news`)),
        catchError(this.handleError('getNews', []))
      );
}



   /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   * @return empty array for the article value
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

        case 0 :
          userMessage = 'offline';
          break;

        default :
        console.log(error);
        userMessage = `Fetch error: ${error.statusText}`;
      }
      if ( userMessage ) {
       this.error(userMessage);
      }

      return of(result as T);
    };
  }

   /**
   * Log message when in dev mode.
   * @param message - log message
   */
  private log(message: string) {
    this.store.dispatch(new AddMessage('NewsService', message));
  }

   /**
   * Log error when in dev mode.
   * @param message - log message
   */
  private error(message: string) {
    this.store.dispatch(new AddError('NewsService', message));
  }
}
