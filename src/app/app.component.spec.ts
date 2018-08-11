import { TestBed, async } from '@angular/core/testing';
import { fakeAsync, tick } from '@angular/core/testing';
import { environment } from '../environments/environment';
import {Location} from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { routes } from './app-routing.module';
import * as NgStore from '@ngxs/store';
import { NgxsModule } from '@ngxs/store';
import { FormsModule } from '@angular/forms';
import { ScrollEventModule } from 'ngx-scroll-event';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from '../testing/in-memory-data.service';
import { CategoryState } from './state/category.state';
import { FilterState } from './state/filter.state';
import { NewsState } from './state/news.state';
import { LogState } from './state/log.state';
import { OnlineState } from './state/online.state';
import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule
  } from '@angular/material';
import { NewsComponent } from './news/news.component';
import { LogComponent } from './log/log.component';
import { CategoryComponent } from './category/category.component';
import { ArticleComponent } from './article/article.component';
import { FilterComponent } from './filter/filter.component';
import { StandaloneComponent } from './standalone/standalone.component';

describe('AppComponent', () => {
  let location: Location;
  let router: Router;
  let fixture;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
        BrowserAnimationsModule,
        HttpClientModule,
        ! environment.production
        ? HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, { delay: 100 })
        : [],
        MatButtonModule,
        MatCardModule,
        MatMenuModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatTabsModule,
        MatTableModule,
        MatToolbarModule,
        NgxsModule,
        FormsModule,
        ScrollEventModule,
        NgxsModule.forRoot([ CategoryState, FilterState, NewsState, LogState, OnlineState ]),
        RouterTestingModule.withRoutes(routes)
      ],
      providers: [
        // CategoryState,
        NgStore.Store, NgStore.StateStream, NgStore.ɵo,
        NgStore.ɵm, NgStore.ɵg, NgStore.ɵl, NgStore.ɵp, NgStore.ɵj
       ]

    }).compileComponents();
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    fixture = TestBed.createComponent(AppComponent);
    router.initialNavigation();

  }));
  it('should create the app', async(() => {
    // const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'marty-news'`, async(() => {
    // const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('marty-news');
  }));

  it('should render title in header', async(() => {
    // const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#title').textContent).toContain('Marty News');
  }));

  it('navigate to "" redirects to /news', fakeAsync(() => {
    router.navigate(['']);
    tick();
    expect(location.path()).toBe('/news');
  }));

  it('navigate to "news" takes to /news', fakeAsync(() => {
    router.navigate(['news']);
    tick();
    expect(location.path()).toBe('/news');
  }));

  it('navigate to "category" takes to /category', fakeAsync(() => {
    router.navigate(['category']);
    tick();
    expect(location.path()).toBe('/category');
  }));

  it('navigate to "log" takes to /log', fakeAsync(() => {
    router.navigate(['log']);
    tick();
    expect(location.path()).toBe('/log');
  }));

  it('navigate to "standalone" takes to /standalone', fakeAsync(() => {
    router.navigate(['standalone']);
    tick();
    expect(location.path()).toBe('/standalone');
  }));

});
