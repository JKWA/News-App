import { Component, OnInit, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { CategoryState } from './state/state.category';
import { CategoryItem } from './category.function';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { InitialNews } from './state/state.news';


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
    this.categories.subscribe(result => {
      result.forEach( category => {
        if ( category.selected ) {
        this.store.dispatch(new InitialNews(category.id));
        }
      });
    }).unsubscribe();
  }

  @HostListener('window:offline', ['$event'])
  openSnackbar(event) {
    this.snackBar.open('No network detected', '', {
      duration: 0,
    });
  }

  @HostListener('window:online', ['$event'])
  closeSnackbar(event) {
    this.snackBar.dismiss();
  }
}

