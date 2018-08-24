import { TestBed, async } from '@angular/core/testing';
import { fakeAsync, tick } from '@angular/core/testing';
import { environment } from '../environments/environment';
import {Location} from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { routes } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { ScrollEventModule } from 'ngx-scroll-event';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from '../testing/in-memory-data.service';
import { StoreModule } from '@ngrx/store';
import * as fromReducers from './reducers';
import { MaterialModule } from './material/material.module';
import { NewsComponent } from './components/news/news.component';
import { LogComponent } from './components/log/log.component';
import { CategoryComponent } from './components/category/category.component';
import { ArticleComponent } from './components/article/article.component';
import { FilterComponent } from './components/filter/filter.component';
import { StandaloneComponent } from './components/standalone/standalone.component';

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
        MaterialModule,
        FormsModule,
        ScrollEventModule,
        StoreModule.forRoot({...fromReducers.reducers}),
        RouterTestingModule.withRoutes(routes)
      ],
      providers: []

    }).compileComponents();
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    fixture = TestBed.createComponent(AppComponent);
    router.initialNavigation();
  }));

  it('should create the app', async(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have title 'marty-news'`, async(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('marty-news');
  }));

  describe('HTML', () => {
    it('should render title in header', async(() => {
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('#title').textContent).toContain('Marty News');
    }));
  });

  describe('Navigator', () => {
    it('expect navigate to "" redirects to /news', fakeAsync(() => {
      router.navigate(['']);
      tick();
      expect(location.path()).toBe('/news');
    }));

    it('expect navigate to "news" takes to /news', fakeAsync(() => {
      router.navigate(['news']);
      tick();
      expect(location.path()).toBe('/news');
    }));

    it('expect navigate to "category" takes to /category', fakeAsync(() => {
      router.navigate(['category']);
      tick();
      expect(location.path()).toBe('/category');
    }));

    it('expect navigate to "log" takes to /log', fakeAsync(() => {
      router.navigate(['log']);
      tick();
      expect(location.path()).toBe('/log');
    }));

    it('expect navigate to "standalone" takes to /standalone', fakeAsync(() => {
      router.navigate(['standalone']);
      tick();
      expect(location.path()).toBe('/standalone');
    }));
  });
});
