import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Article } from '../article';
import { getKey } from '../shared/defaults/key';
import { getSources } from '../shared/defaults/source.default';
import { Category } from '../enums/category.enum';
import { Service } from '../enums/service.enum';
import { ArticlePayload } from '../models/article-payload.model';
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
  ) { }


/**
 * gets news from the api
 *
 * @param {Category} category
 * @param {number} pageNumber
 * @param {*} filters
 * @returns {Observable<Article[]>}
 * @memberof NewsDataService
 */
getNews (category: Category, pageNumber: number, filters): Observable<ArticlePayload> {

    const sources: string = getSources(category).map(item => item.id).join();

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
          const articles = result.map(article => {
              article.id = encodeURIComponent(article.title);
              // remove photo urls that are not https or that are not formatted correctly
              const expression = /https:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
              const regex = new RegExp(expression);
              if ( article.urlToImage ) {
              if ( ! article.urlToImage.match(regex) ) {
                 article.urlToImage = null;
              }
            }
            if ( isDevMode() ) {
              delete article.urlToImage; // avoid image errors on console
              // make id unique by category -- indexed DB issue
              article.title = `CATEGORY ${category}: PAGE ${pageNumber.toString()}: ${article.title}`;
            }
            return article;
          });
          return {category, articles, service: Service.NewsAPI};

        }),
        // map(articles => {
        //   return {category, articles, service: Service.NewsAPI};
        // })
      );
  }
}
