import { Component } from '@angular/core';
import { NewsSectionModel } from '../../models/news-section.model';
import * as NewsSectionActions from '../../actions/news-section.actions';
import { stringToNewsSection } from '../../shared/utility/news-section.utility';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as fromNewsSection from '../../reducers';
import { tap, map } from 'rxjs/operators';


@Component({
  selector: 'app-news-section',
  templateUrl: './news-section.component.html',
  styleUrls: ['./news-section.component.css']
})

export class NewsSectionComponent {

    constructor(private store: Store<fromNewsSection.State>) {}

    get getAllNewsSections(): Observable<NewsSectionModel[]> {
      return this.store.pipe(
        select(fromNewsSection.getAllNewsSections),
        map(results => Array.from(results.values())),
        // tap(console.log)
      );
    }


/**
 * changing values from the toggle button updates the newsSection state
 *
 * @param {*} newsSection
 * @param {*} {checked}
 * @memberof NewsSectionComponent
 */
onClick(newsSection, {checked}): void {

    if ( checked ) {
      this.store.dispatch(new NewsSectionActions.AddNewsSection(stringToNewsSection(newsSection.id)));
      // this.store.dispatch(new InitialNews(newsSection.id));

    } else {
      this.store.dispatch(new NewsSectionActions.RemoveNewsSection(stringToNewsSection(newsSection.id)));

    }
  }

}
