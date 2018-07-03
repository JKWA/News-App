import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../article';
import { NewsService } from '../service/news.service';
import { LocalDbService } from '../service/local-db.service';

import { Store, Select } from '@ngxs/store';
import { Observable, concat } from 'rxjs';
import { Filter, FilterStateModel, FilterState } from '../state/state.filter';
import { RetrievingNews, AddNews, NewsState } from '../state/state.news';
import { Category, stringToCategory } from '../category';


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
  throttle = 300;
  scrollDistance = 0;

  @Select(NewsState) news: Observable<any>;
  constructor(
    private newsService: NewsService,
    private localDbService: LocalDbService,
    private store: Store,
  ) { }

  ngOnInit() {
    // console.log(this.category);
    this.getFromClientDatabase(this.category, this.listOfFilters);
    this.getNews(this.listOfFilters, this.pageNumber);
  }

  getFromClientDatabase (category, filters) {
    this.retrieving = true;
    filters.subscribe(result => {
      this.localDbService.getData(category)
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
        });
      });

  }

  onScrollDown (ev) {
    const percent = ev.currentScrollPosition / document.body.offsetHeight;
    this.pageNumber++;
    if ( percent > .7 && !this.retrieving && this.pageNumber <= 5 ) {
      this.getNews(this.listOfFilters, this.pageNumber);
    }

  }

  getNews(filters, pageNumber): void {
    this.retrieving = true;
    const categoryEnum = stringToCategory(this.category);

    filters.subscribe(result => {
      this.newsService.getNews(categoryEnum, pageNumber, result.listOfFilters)
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
