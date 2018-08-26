import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ScrollEventModule } from 'ngx-scroll-event';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from '../testing/in-memory-data.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MaterialModule } from './material/material.module';
import { NewsComponent } from './components/news/news.component';
import { LogComponent } from './components/log/log.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CategoryComponent } from './components/category/category.component';
import { AppRoutingModule } from './app-routing.module';
import { ArticleComponent } from './components/article/article.component';
import { FilterComponent } from './components/filter/filter.component';
import { StandaloneComponent } from './components/standalone/standalone.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CategoryEffects } from './effects/category.effects';
import { FilterEffects } from './effects/filter.effects';
import { LogEffects } from './effects/log.effects';
import { NewsEffects } from './effects/news.effects';
import { AppStatusEffects } from './effects/app-status.effects';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { SharedModule } from './shared/shared.module';

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
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    ScrollEventModule,
    LayoutModule,
    MaterialModule,
    SharedModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    AppRoutingModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([AppStatusEffects, CategoryEffects, FilterEffects, LogEffects, NewsEffects]),

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
