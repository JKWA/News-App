import { Component, OnInit, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { CategoryState, SetCategory, CategoryStateModel, categoryToObject, stringToCategory, Category } from './state/state.category';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AddNews, AddLocalNews } from './state/state.news';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  @Select(CategoryState.categories) categories: Observable<Set<Category>>;

  constructor(
    public snackBar: MatSnackBar,
    private store: Store,
  ) { }

  ngOnInit() {
    this.categories.subscribe(result => {
      result.forEach( category => {
        this.store.dispatch(new AddNews(category, false));
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

