import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Article } from '../article';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { FilterState, Filter } from '../state/filter.state';
import { NewsStateModel, NewsState, AddNews } from '../state/news.state';
import { OnlineState } from '../state/online.state';
import { CategoryState } from '../state/category.state';
import { CategoryItem } from '../utility/category.utility';
import { ScrollEvent } from 'ngx-scroll-event';
import { AddMessage } from '../state/log.state';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
  providers: []
})

export class ArticleComponent implements OnInit, OnDestroy {

  @Input() category: string;
  @Select(FilterState.allFilters) filters: Observable<Set<Filter>>;
  @Select(NewsState) stateNews: Observable<NewsStateModel[]>;
  @Select(CategoryState.setCategory) setCategory: Observable<CategoryItem>;
  @Select(OnlineState.online) onlineStatus: Observable<boolean>;

  // articles: Article[];
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
  onlineSubscription;
  newsStateSubscription;

  constructor(
    private store: Store,
  ) { }

  ngOnInit() {
    this.watchCategoryBeingViewed();
    this.onlineSubscription = this.onlineStatus.subscribe( result => this.online = result);

    this.newsStateSubscription = this.stateNews.pipe(
      map( results => {
        return results && results[this.category]
                ? results[this.category].clientDataLoaded
                : false;
      }),
      tap(complete => {
        if ( complete && !this.initialScroll ) {
          setTimeout(_ => this.scrollToLastViewed(), 300);
          this.initialScroll = true;
        }
      })
    ).subscribe();

  }

  ngOnDestroy() {
    this.onlineSubscription.unsubscribe();
    this.newsStateSubscription.unsubscribe();
    clearTimeout(this.throttle);
  }

/**
 * get articles by category and apply filters
 *
 * @readonly
 * @type {Observable<Article[]>}
 * @memberof ArticleComponent
 */
get getArticles(): Observable<Article[]> {
    return this.stateNews.pipe(
      withLatestFrom(this.filters),
      map(([stateNews, filters]) => {
        const regFilter = new RegExp(Array.from(filters).join('|'), 'i');
        const allArticles = stateNews && stateNews.hasOwnProperty(this.category)
                              ? stateNews[this.category].articles
                              : [];
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

/**
 * observe when first load of articles is completed
 *
 * @readonly
 * @memberof ArticleComponent
 */
  get initialArticleLoadComplete(): Observable<boolean> {
    return this.stateNews.pipe(
      map( results => results[this.category].firstLoadComplete)
    );
  }



/**
 * identifies which category is currently being viewed
 *
 * @private
 * @memberof ArticleComponent
 */
  private watchCategoryBeingViewed() {
    this.setCategory.subscribe(category => {
      this.tabViewed = category;
    });
  }

/**
 * watch scroll event and trigger for more articles when reaching bottom
 * @param event - the event from template
 */
  public handleScroll(event: ScrollEvent): void {

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

  }


/**
 * set to last viewed article and forward to url
 *
 * @param {*} article
 * @memberof ArticleComponent
 */
  public gotToArticle (article): void {
    window.localStorage.setItem('lastReadArticle', article.id);
    if ( this.online ) {
      window.location.href = article.url;
    }
  }

 /**
 * if article id matches last viewed, then sroll to this position
  *
  * @private
  * @memberof ArticleComponent
  */
 private scrollToLastViewed(): void {
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
