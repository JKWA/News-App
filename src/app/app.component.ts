import { Component, OnInit, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { CategoryItem } from './utility/category.utility';
import { stringToCategory } from './utility/category.utility';
import { Observable } from 'rxjs';
// import { UpdateOnline } from './state/online.state';
import { take, tap, map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import * as fromNews from './reducers';
import * as fromCategory from './reducers';
import * as NewsActions from './actions/news.actions';
import * as OnlineActions from './actions/online.actions';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'marty-news';

  constructor(
    public snackBar: MatSnackBar,
    private store: Store<fromNews.State>
  ) { }

  get getSelectedCategories(): Observable<CategoryItem[]> {
    return this.store.pipe(
      select(fromCategory.getAllCategories),
      map(results => Array.from(results.values()).filter(result => result.selected))
    );
  }

  ngOnInit() {
    this.setNewsData();
  }

/**
 * is mobile device and not standalone
 *
 * @readonly
 * @memberof AppComponent
 */
get isMobleAndEmbedded() {
    const isMobile = /iphone|ipad|ipod|android/.test( navigator.userAgent.toLowerCase() );

    // @ts-ignore
    const isStandalone = ('standalone' in navigator) && (navigator.standalone) || window.matchMedia('(display-mode: standalone)').matches;
    return isMobile
            ?  isStandalone
              ? false
              : true // if ios and not running in standalone mode
            : false;
  }

/**
 *get data for all selected categories
 *
 * @memberof AppComponent
 */
setNewsData() {
    this.getSelectedCategories.pipe(
      take(1),
      tap( result => {
        result.forEach( category => {
          // if ( category.selected ) {
          // this.store.dispatch(new InitialNews(category.id));
          // }
          this.store.dispatch(new NewsActions.InitiateNews(stringToCategory(category.id)));

        });
      })
    ).subscribe();
  }

  /**
   * open offline message and dispatch status
   *
   * @param {*} event
   * @memberof AppComponent
   */
  @HostListener('window:offline', ['$event'])
  openSnackbar( _ ) {
    this.store.dispatch(new OnlineActions.Offline());
    this.snackBar.open('No network detected', '', {
      duration: 0,
    });
  }

/**
 * closes offline message and dispatch
 *
 * @param {*} event
 * @memberof AppComponent
 */
  @HostListener('window:online', ['$event'])
  closeSnackbar(event) {
    this.store.dispatch(new OnlineActions.Online());

    this.snackBar.dismiss();
  }

}

