import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../article';
import { Store, Action, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FilterStateModel, FilterState } from '../state/state.filter';
import { NewsStateModel, NewsState, AddNews } from '../state/state.news';
import { CategoryState, Category } from '../state/state.category';
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
  @Select(FilterState) filters: Observable<FilterStateModel>;
  @Select(NewsState) stateNews: Observable<NewsStateModel[]>;
  @Select(CategoryState.setCategory) setCategory: Observable<Category>;


  articles: Article[];
  pageNumber = 1;
  retrieving = false;
  bottomOffset = 1000;
  topOffset = 1;
  scrolledToInititalView = true;
  tabViewed: Category;

  constructor(
    private store: Store,
  ) { }

  ngOnInit() {

    this.stateNews.subscribe(result => {
      this.articles = result[this.category].articles;
      this.retrieving = result[this.category].retrieving;
      this.scrollToLastViewed();
    });

    this.setCategory.subscribe(category => {
      this.tabViewed = category;
    });
  }

  public handleScroll(event: ScrollEvent) {

    if (event.isReachingBottom
        && window.navigator.onLine
        && !this.retrieving
        && this.category === this.tabViewed
      ) {
        this.store.dispatch(new AddNews(this.category, false));
    }

    // if (event.isReachingTop) {
    //   console.log(`the user is reaching the top`);
    // }

  }

  public gotToArticle (article) {
    window.localStorage.setItem('lastReadArticle', article.anchorText);
    window.location.href = article.url;
  }

  private scrollToLastViewed() {
    const anchor = window.localStorage.getItem('lastReadArticle');
    if (anchor) {
      const article = document.getElementById(anchor);
      if (this.scrolledToInititalView) {
        if (article) {
          if (this.category === this.tabViewed) {
            article.scrollIntoView({behavior: 'smooth'});
            this.scrolledToInititalView = false;
            this.store.dispatch(new AddMessage('Article Component', 'scrolled to last viewed'));
          }
        }
      }
    }
  }

}
