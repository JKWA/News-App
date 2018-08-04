import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../article';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { interval, merge } from 'rxjs';
import { map, tap, exhaustMap, startWith, withLatestFrom } from 'rxjs/operators';

import { FilterState, Filter } from '../state/filter.state';
import { NewsStateModel, NewsState, AddNews } from '../state/news.state';
import { OnlineState } from '../state/online.state';
import { CategoryState } from '../state/category.state';
import { CategoryItem } from '../category.function';

import { ScrollEvent } from 'ngx-scroll-event';
import { AddMessage } from '../state/log.state';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
  providers: []
})

export class ArticleComponent implements OnInit {

  @Input() category: string;
  @Select(FilterState.allFilters) filters: Observable<Set<Filter>>;
  @Select(NewsState) stateNews: Observable<NewsStateModel[]>;
  @Select(CategoryState.setCategory) setCategory: Observable<CategoryItem>;
  @Select(OnlineState.online) onlineStatus: Observable<boolean>;

  articles: Article[];
  pageNumber = 1;
  retrieving = true;
  bottomOffset = 1000;
  topOffset = 1;
  scrolledToInititalView = true;
  tabViewed: CategoryItem;
  online = true;
  currentlyAddingDataLock = false;
  throttle;
  initialScroll = false;

  constructor(
    private store: Store,
  ) { }

  ngOnInit() {
    this.watchCategoryBeingViewed();
    this.onlineStatus.subscribe( result => this.online = result);

    this.stateNews.pipe(
      map( results => results[this.category].clientDataLoaded),
      tap(complete => {
        if ( complete && !this.initialScroll ) {
          setTimeout(_ => this.scrollToLastViewed(), 300);
          this.initialScroll = true;
        }
      })
    ).subscribe();

  }

  get getArticles() {
    return this.stateNews.pipe(
      withLatestFrom(this.filters),
      map(([stateNews, filters]) => {
        const regFilter = new RegExp(Array.from(filters).join('|'), 'i');
        const allArticles = stateNews[this.category].articles;
        return filters.size
          ? allArticles.filter(article => {
              return article.title && article.description
                    ? ! (article.title.match(regFilter) || article.description.match(regFilter) || article.source.name.match(regFilter))
                    : false;
          })
          : allArticles;
      })
    );
  }

  get initialArticleLoadComplete() {
    return this.stateNews.pipe(
      map( results => results[this.category].firstLoadComplete)
    );
  }


  /**
 * watch the tab being viewed
 * used for scrolling event to identify which category should be triggered
 * to add articles
 */
  watchCategoryBeingViewed() {
    this.setCategory.subscribe(category => {
      this.tabViewed = category;
    });
  }

/**
 * watch scroll event and trigger for more articles when reaching bottom
 * @param event - the event from template
 */
  public handleScroll(event: ScrollEvent) {

    if (event.isReachingBottom
        && window.navigator.onLine
        && this.category === this.tabViewed.id
        && !this.currentlyAddingDataLock
      ) {
        this.currentlyAddingDataLock = true;
        clearTimeout(this.throttle);
        this.throttle = setTimeout(() => this.currentlyAddingDataLock = false, 2000);
        this.store.dispatch(new AddNews(this.category));
    }

    // if (event.isReachingTop) {
    //   console.log(`the user is reaching the top`);
    // }

  }


  /**
 * set to last viewed article and forward to url
 * @param event - the event from template
 */
  public gotToArticle (article) {
    window.localStorage.setItem('lastReadArticle', article.id);
    if ( this.online ) {
      window.location.href = article.url;
    }
  }

  /**
 * if article id matches last viewed, then sroll to this position
 */
  private scrollToLastViewed() {
    const anchor = window.localStorage.getItem('lastReadArticle');
    if (anchor) {
      const article = document.getElementById(anchor);
      if (this.scrolledToInititalView) {
        if (article) {
          if (this.category === this.tabViewed.id) {
            article.scrollIntoView({behavior: 'smooth'});
            this.scrolledToInititalView = false;
            this.store.dispatch(new AddMessage('Article Component', 'scrolled to last viewed'));
          }
        }
      }
    }
  }

}
