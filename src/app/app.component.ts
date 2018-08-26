import { Component, OnInit, HostListener } from '@angular/core';
import { CategoryItem } from './utility/category.utility';
import { stringToCategory } from './utility/category.utility';
import { Observable } from 'rxjs';
import { take, tap, map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import * as fromNews from './reducers';
import * as fromCategory from './reducers';
import * as fromAppStatus from './reducers';
import { Device } from './enums/device.enum';
import * as NewsActions from './actions/news.actions';
import * as AppStateActions from './actions/app-status.actions';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'marty-news';

  constructor(
    private store: Store<fromNews.State>
  ) { }

  get getSelectedCategories(): Observable<CategoryItem[]> {
    return this.store.pipe(
      select(fromCategory.getAllCategories),
      map(results => Array.from(results.values()).filter(result => result.selected))
    );
  }

  get showStandaloneMenuItem() {
    return this.store.pipe(
      select(fromAppStatus.getAppStatusState),
      take(1),
      map(state => {
        return (state.device === Device.Iphone || state.device === Device.Android)
                  ? state.standalone
                    ? false
                    : true
                  : false;
      }),
    );
  }

  ngOnInit() {
    this.setNewsData();
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
          this.store.dispatch(new NewsActions.InitiateNews(stringToCategory(category.id)));
        });
      })
    ).subscribe();
  }

  /**
   * dispatch offline
   *
   * @param {*} event
   * @memberof AppComponent
   */
  @HostListener('window:offline', ['$event'])
  dispatchOffline( _ ) {
    this.store.dispatch(new AppStateActions.Offline());
  }

/**
 * dispatch online
 *
 * @param {*} event
 * @memberof AppComponent
 */
  @HostListener('window:online', ['$event'])
  dispatchOnline(_) {
    this.store.dispatch(new AppStateActions.Online());
  }

}

