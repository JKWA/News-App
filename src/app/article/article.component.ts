import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../article';
import { NewsService } from '../service/news.service';
import { LocalDbService } from '../service/local-db.service';

import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FilterStateModel, FilterState } from '../state/state.filter';
import { stringToCategory } from '../category';
import { ScrollEvent } from 'ngx-scroll-event';
import { Router } from '@angular/router';


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
  scrolledToInititalView = true;

  constructor(
    private newsService: NewsService,
    private localDbService: LocalDbService,
    private store: Store,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getFromClientDatabase();
    this.getNews();
  }

  private scrollToLastViewed() {
    const anchor = window.localStorage.getItem('lastReadArticle');
    if (anchor) {
      const article = document.getElementById(anchor);
      if (this.scrolledToInititalView) {
        if (article) {
          if (this.category === this.router.routerState.snapshot.root.firstChild.params.id) {
            article.scrollIntoView({behavior: 'smooth'});
            // console.log(`SCROLLING: ${anchor}`);
            this.scrolledToInititalView = false;
          }
        }
      }
    }
  }

  public gotToArticle (article) {
    // save state for iOS
    window.localStorage.setItem('lastReadArticle', article.anchorText);
    window.location.href = article.url;
  }

  public handleScroll(event: ScrollEvent) {

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
            : false)
            .map(article => {
              article.anchorText = encodeURIComponent(this.category + '_' + article.title);
              return article;
            });

          if (! this.articles ) {
            this.articles = this.removeDuplicateTitles(filteredNews);
          } else {
            this.articles = this.removeDuplicateTitles(this.articles.concat( filteredNews ));
          }
          this.retrieving = false;
        })
        .then(_ => {
          this.scrollToLastViewed();
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
            : false)
            .map(article => {
              article.anchorText = encodeURIComponent(this.category + '_' + article.title);
              return article;
            });

          if (! this.articles ) {
            this.articles = this.removeDuplicateTitles(filteredNews);
          } else {
            this.articles = this.removeDuplicateTitles(this.articles.concat( filteredNews ));
          }
          this.pageNumber++;
          this.retrieving = false;
          this.scrollToLastViewed();
        });
      });
  }

  private addAnchorText(articles: Article[]) {
    return articles.map(article => {
      return article.anchorText = encodeURIComponent(article.title);
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
