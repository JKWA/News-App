import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ScrollEventModule } from 'ngx-scroll-event';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { NgxsModule } from '@ngxs/store';
import { InMemoryDataService } from '../testing/in-memory-data.service';
import { CategoryState } from './state/category.state';
import { FilterState } from './state/filter.state';
import { NewsState } from './state/news.state';
import { LogState } from './state/log.state';
import { OnlineState } from './state/online.state';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import {
  MatToolbarModule,
  MatTableModule,
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
  MatProgressSpinnerModule} from '@angular/material';
import { NewsComponent } from './news/news.component';
import { LogComponent } from './log/log.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CategoryComponent } from './category/category.component';
import { AppRoutingModule } from './app-routing.module';
import { ArticleComponent } from './article/article.component';
import { FilterComponent } from './filter/filter.component';
import { StandaloneComponent } from './standalone/standalone.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CategoryEffects } from './effects/category.effects';
import { FilterEffects } from './effects/filter.effects';
import { LogEffects } from './effects/log.effects';
import { NewsEffects } from './effects/news.effects';



import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  declarations: [
    AppComponent,
    NewsComponent,
    LogComponent,
    CategoryComponent,
    ArticleComponent,
    FilterComponent,
    StandaloneComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ! environment.production
      ? HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService)
      : [],
    NgxsModule.forRoot([ CategoryState, FilterState, NewsState, LogState, OnlineState ]),
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    ScrollEventModule,
    LayoutModule,
    MatToolbarModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
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
    StoreModule.forRoot(reducers, { metaReducers }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([CategoryEffects, FilterEffects, LogEffects, NewsEffects]),

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
