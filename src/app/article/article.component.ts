import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../article';
import { NewsService } from '../service/news.service';
import { LocalDbService } from '../service/local-db.service';

import { Store, Select } from '@ngxs/store';
import { Observable, concat } from 'rxjs';
import { Filter, FilterStateModel, FilterState } from '../state/state.filter';
import { RetrievingNews, AddNews, NewsState } from '../state/state.news';
import { Category, stringToCategory } from '../category';
import { ScrollEvent } from 'ngx-scroll-event';


@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})

export class ArticleComponent implements OnInit {

  articles: Article[];
  @Input() category: string;
  @Select(FilterState) listOfFilters: Observable<Set<string>>;

  pageNumber = 1;
  retrieving = false;

  bottomOffset = 1000;
  topOffset = 0;

  @Select(NewsState) news: Observable<any>;
  constructor(
    private newsService: NewsService,
    private localDbService: LocalDbService,
    private store: Store,
  ) { }

  ngOnInit() {
    this.getFromClientDatabase(this.category, this.listOfFilters);
    this.getNews(this.listOfFilters);
  }

  public handleScroll(event: ScrollEvent) {

    if (event.isReachingBottom
        && (this.pageNumber <= 5)
        && window.navigator.onLine
        && !this.retrieving
      ) {

      console.log(`${this.category}: ${this.pageNumber}`);
      this.getNews(this.listOfFilters);

    }
    // if (event.isReachingTop) {
      // console.log(`the user is reaching the top`);
    // }

  }

  getFromClientDatabase (category: string, filters) {
    this.retrieving = true;
    filters.subscribe(result => {
      this.localDbService.getData(stringToCategory(category))
        .then(news => {
          const regFilter = new RegExp(Array.from(result.listOfFilters).join('|'), 'i');

          const filteredNews = news.filter(article => article.title && article.description
            ? !(article.title.match(regFilter) || article.description.match(regFilter))
            : false);

          if (! this.articles ) {
            this.articles = this.removeDuplicateTitles(filteredNews);
          } else {
            this.articles = this.removeDuplicateTitles(this.articles.concat( filteredNews ));
          }
          this.retrieving = false;
        })
        .catch(error => {
          console.log(error);
        });

      });

  }

  getNews(filters): void {

    if ( !window.navigator.onLine  || this.pageNumber > 5 ) {
      return;
    }

    console.log('GET: ' + this.category);

    this.retrieving = true;
    const categoryEnum = stringToCategory(this.category);

    filters.subscribe(result => {
      this.newsService.getNews(categoryEnum, this.pageNumber, result.listOfFilters)
        .subscribe(news => {
          const regFilter = new RegExp(Array.from(result.listOfFilters).join('|'), 'i');

          const filteredNews = news.filter(article => article.title && article.description
            ? !(article.title.match(regFilter) || article.description.match(regFilter))
            : false);

          if (! this.articles ) {
            this.articles = this.removeDuplicateTitles(filteredNews);
          } else {
            this.articles = this.removeDuplicateTitles(this.articles.concat( filteredNews ));
          }
          this.pageNumber++;
          this.retrieving = false;
        });
      });
  }

  removeDuplicateTitles(articles: Article[]): Article[] {
    const articleMap = new Map ();
    const deDupped = [];

    articles.map(article => articleMap.set(article.title, article));
    articleMap.forEach(item => deDupped.push(item));

    return deDupped;
  }
}
