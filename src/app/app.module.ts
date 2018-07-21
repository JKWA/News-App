import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ScrollEventModule } from 'ngx-scroll-event';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { CategoryState } from './state/state.category';
import { FilterState } from './state/state.filter';
import { NewsState } from './state/state.news';
import { LogState } from './state/state.log';


import { FlexLayoutModule } from '@angular/flex-layout';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import {
  MatToolbarModule,
  MatButtonModule,
  MatInputModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatIconModule,
  MatListModule,
  MatGridListModule,
  MatCardModule,
  MatMenuModule,
  MatTabsModule} from '@angular/material';
import { NewsComponent } from './news/news.component';
import { LogComponent } from './log/log.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CategoryComponent } from './category/category.component';
import { AppRoutingModule } from './app-routing.module';
import { ArticleComponent } from './article/article.component';
import { FilterComponent } from './filter/filter.component';

@NgModule({
  declarations: [
    AppComponent,
    NewsComponent,
    LogComponent,
    CategoryComponent,
    ArticleComponent,
    FilterComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxsModule.forRoot([ CategoryState, FilterState, NewsState, LogState ]),
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    ScrollEventModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatTabsModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
