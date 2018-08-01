import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Article } from '../article';
import { getKey } from '../key';
import { getSources } from '../source';
import { Category } from '../category.enum';

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

  getNews (category: Category, pageNumber: number, filters) {

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
          return result.map(article => {

              article.id = encodeURIComponent(article.title);

              // remove photo urls that are not https or that are not formatted correctly
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
      );
  }
}
