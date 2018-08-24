import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Article } from '../../article';
import { Observable } from 'rxjs';
import { map, tap, take, withLatestFrom } from 'rxjs/operators';
import { Category } from '../../enums/category.enum';
import { Store, select } from '@ngrx/store';
import * as fromNews from './../../reducers';
import * as fromFilters from './../../reducers';
import * as fromCategory from './../../reducers';
import * as fromAppStatus from './../../reducers';

import * as NewsActions from './../../actions/news.actions';
import { ScrollEvent } from 'ngx-scroll-event';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
  providers: []
})

export class ArticleComponent implements OnInit, OnDestroy {

  @Input() category: string;
  pageNumber = 1;
  retrieving = true;
  bottomOffset = 1000;
  topOffset = 1;
  scrolledToInititalView = true;
  tabViewed: Category;
  initialScroll = false;
  viewedCategorySubscription;

  constructor(
    private store: Store<fromNews.State>
  ) { }

  ngOnInit() {
    this.watchCategoryBeingViewed();
  }

  ngOnDestroy() {
    this.viewedCategorySubscription.unsubscribe();
  }

  get isOffline() {
    return this.store.pipe(
      select(fromAppStatus.getOnlineState),
      take(1),
      map(online => !online),
    );
  }

get getFilters() {
    return this.store.pipe(select(fromFilters.getAllFilters));
  }

get getArticles(): Observable<Article[]> {
    return this.store.pipe(
      select(fromNews.getAllArticles),
      withLatestFrom(this.getFilters),
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
 * identifies which category is currently being viewed
 *
 * @private
 * @memberof ArticleComponent
 */
  private watchCategoryBeingViewed() {
    this.viewedCategorySubscription = this.store.pipe(
      select(fromCategory.getViewingCategory),
      tap(result => this.tabViewed = result)
    ).subscribe();
  }

/**
 * watch scroll event and trigger for more articles when reaching bottom
 * @param event - the event from template
 */
  public handleScroll(event: ScrollEvent): void {

    if (event.isReachingBottom
        && window.navigator.onLine
        && this.category === this.tabViewed
      ) {
        this.store.dispatch(new NewsActions.GetAdditionalNewsFromApi(this.category));
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
      window.location.href = article.url;
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
          if (this.category === this.tabViewed) {
            article.scrollIntoView({behavior: 'smooth'});
            this.scrolledToInititalView = false;
            // this.store.dispatch(new AddMessage('Article Component', 'scrolled to last viewed'));
          }
        }
      }
    }
  }

}
