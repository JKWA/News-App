import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../article';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FilterState, Filter } from '../state/state.filter';
import { NewsStateModel, NewsState, AddNews } from '../state/state.news';
import { OnlineState } from '../state/state.online';
import { CategoryState } from '../state/state.category';
import { CategoryItem } from '../category.function';

import { ScrollEvent } from 'ngx-scroll-event';
import { AddMessage } from '../state/state.log';

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
  retrieving = false;
  bottomOffset = 1000;
  topOffset = 1;
  scrolledToInititalView = true;
  tabViewed: CategoryItem;
  online = true;

  constructor(
    private store: Store,
  ) { }

  ngOnInit() {
    this.setPageData();
    this.watchCategoryBeingViewed();
    this.onlineStatus.subscribe( result => this.online = result);
  }

/**
 * observe and filter articles
 */
  setPageData() {
    this.stateNews.subscribe(result => {
      this.filters.subscribe(filters => {
        // console.log(result[this.category].articles.length)

        const regFilter = new RegExp(Array.from(filters).join('|'), 'i');
            const allArticles = result[this.category].articles;
            this.articles = filters.size
              ? allArticles.filter(article => {
                  return article.title && article.description
                        ? ! (article.title.match(regFilter) || article.description.match(regFilter) || article.source.name.match(regFilter))
                        : false;
              })
              : allArticles;
          if ( result[this.category].firstLoad ) {
            this.scrollToLastViewed();
          }
      });
      this.retrieving = result[this.category].retrieving;
    });
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
    // console.log(event.originalEvent.returnValue);



    if (event.isReachingBottom
        && window.navigator.onLine
        && !this.retrieving
        && this.category === this.tabViewed.id
      ) {
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
