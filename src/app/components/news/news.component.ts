import { Component } from '@angular/core';
import { stringToNewsSection } from '../../shared/utility/news-section.utility';
import { NewsSectionModel } from '../../models/news-section.model';
import * as NewsSectionActions from '../../actions/news-section.actions';
import { Observable, of } from 'rxjs';
import { map, tap, withLatestFrom, catchError } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import * as fromNewsSection from './../../reducers';



@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})

export class NewsComponent {

  tabSelected = 0;

  constructor(private store: Store<fromNewsSection.State>) {}

  get getViewingNewsSection() {
    return this.store.pipe(select(fromNewsSection.getViewingNewsSection));
  }

/**
 *
 *
 * @readonly
 * @type {Observable<Set<NewsSectionModel>>}
 * @memberof NewsComponent
 */
get getSelectedSections(): Observable<NewsSectionModel[]> {
  return this.store.pipe(
    select(fromNewsSection.getAllNewsSections),
    map(results => Array.from(results.values()).filter(result => result.selected))
  );
}


get selectedIndex(): Observable<number> {

    return this.getSelectedSections.pipe(
        withLatestFrom(this.getViewingNewsSection),
        map(([categories, currentlyViewingNewsSection]) => {
          const catArray = Array.from(categories);
          const find = catArray.find(cat => cat.id === currentlyViewingNewsSection);
          if (!find) {
            this.store.dispatch(new NewsSectionActions.SetCurrentlyViewingNewsSection(stringToNewsSection(catArray[0].id)));
          }
          return find ? catArray.indexOf(find) : 0;
        }),
        catchError(_ =>  of(0))
    );
}


/**
 * tab changes are reflected to newsSection state
 *
 * @param {*} event
 * @memberof NewsComponent
 */
public tabChanged(event): void {

  this.store.pipe(
    select(fromNewsSection.getAllNewsSections),
    map(results => Array.from(results.values()).filter(result => result.selected)[event]),
    tap(result => this.store.dispatch(new NewsSectionActions.SetCurrentlyViewingNewsSection(stringToNewsSection(result.id))))
  ).subscribe();
  }

}
