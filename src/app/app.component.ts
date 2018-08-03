import { Component, OnInit, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { CategoryState } from './state/state.category';
import { CategoryItem } from './category.function';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { InitialNews } from './state/state.news';
import { UpdateOnline } from './state/state.online';
import { take, tap } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'marty-news';
  @Select(CategoryState.allCategories) categories: Observable<Map<string, CategoryItem>>;

  constructor(
    public snackBar: MatSnackBar,
    private store: Store,
  ) { }

  ngOnInit() {
    this.setNewsData();
  }

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


  setNewsData() {
    this.categories.pipe(
      take(1),
      tap( result => {
        result.forEach( category => {
          if ( category.selected ) {
          this.store.dispatch(new InitialNews(category.id));
          }
        });
      })
    ).subscribe();
  }




  openStandAloneMessage() {
    // this.store.dispatch(new UpdateOnline(false));
    this.snackBar.open('Save to your homescreen', '', {
      duration: 0,
    });
  }


  @HostListener('window:offline', ['$event'])
  openSnackbar(event) {
    this.store.dispatch(new UpdateOnline(false));
    this.snackBar.open('No network detected', '', {
      duration: 0,
    });
  }

  @HostListener('window:online', ['$event'])
  closeSnackbar(event) {
    this.store.dispatch(new UpdateOnline(true));
    this.snackBar.dismiss();
  }
}

