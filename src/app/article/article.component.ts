import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../article';
import { NewsService } from '../service/news.service';
import { LocalDbService } from '../service/local-db.service';

import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FilterStateModel, FilterState } from '../state/state.filter';
import { Category, stringToCategory } from '../category';
import { ScrollEvent } from 'ngx-scroll-event';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})

export class ArticleComponent implements OnInit {

  @Input() category: string;
  @Select(FilterState) filters: Observable<FilterStateModel>;
  articles: Article[];
  pageNumber = 1;
  retrieving = false;
  bottomOffset = 1000;
  topOffset = 1;
  initialScroll = true;

  constructor(
    private newsService: NewsService,
    private localDbService: LocalDbService,
    private store: Store,
    private router: Router,
  ) { }

  ngOnInit() {

    // wait 2 seconds before tracking state of new scroll events
    setTimeout(() => {
      this.initialScroll = false;
    }, 2000);

    this.getFromClientDatabase();
    this.getNews();
  }

  public handleScroll(event: ScrollEvent) {

    if ( !this.initialScroll) {
      window.localStorage.setItem('scrollPosition', window.scrollY.toString());
    }

    const state = this.router.routerState;

    if (event.isReachingBottom
        && (this.pageNumber <= 5)
        && window.navigator.onLine
        && !this.retrieving
        && this.category === state.snapshot.root.firstChild.params.id
      ) {
      this.getNews();
    }

    if (event.isReachingTop) {
      console.log(`the user is reaching the top`);
    }

  }

  private getFromClientDatabase () {
    this.retrieving = true;
    this.filters.subscribe(result => {
      this.localDbService.getData(stringToCategory(this.category))
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

          // TODO: update so only for iOS standalone
          window.scrollTo({
            behavior: 'smooth',
            left: 0,
            top: window.localStorage.getItem('scrollPosition')
                  ? parseInt(window.localStorage.getItem('scrollPosition'), 10)
                  : 0
            });
        })
        .catch(error => {
          console.log(error);
        });

      });

  }

  getNews(): void {

    if ( !window.navigator.onLine  || this.pageNumber > 5 ) {
      return;
    }

    this.retrieving = true;
    const categoryEnum = stringToCategory(this.category);

    this.filters.subscribe(result => {

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


  private  removeDuplicateTitles(articles: Article[]): Article[] {
    const articleMap = new Map ();
    const deDupped = [];

    articles.map(article => articleMap.set(article.title, article));
    articleMap.forEach(item => deDupped.push(item));

    return deDupped;
  }
}
