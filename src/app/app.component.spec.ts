import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import * as NgStore from '@ngxs/store';
import { FormsModule } from '@angular/forms';
import { ScrollEventModule } from 'ngx-scroll-event';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { CategoryState } from './state/category.state';
import { FilterState } from './state/filter.state';
import { NewsState } from './state/news.state';
import { LogState } from './state/log.state';
import { OnlineState } from './state/online.state';
import {
  MatToolbarModule,
  MatTableModule,
  MatButtonModule,
  MatInputModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatIconModule,
  MatCardModule,
  MatMenuModule,
  MatTabsModule,
  MatProgressSpinnerModule} from '@angular/material';
import { NewsComponent } from './news/news.component';
import { LogComponent } from './log/log.component';
import { CategoryComponent } from './category/category.component';
import { ArticleComponent } from './article/article.component';
import { FilterComponent } from './filter/filter.component';
import { StandaloneComponent } from './standalone/standalone.component';


describe('AppComponent', () => {
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
        HttpClientModule,
        MatMenuModule,
        MatIconModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatToolbarModule,
        MatTabsModule,
        MatTableModule,
        MatProgressSpinnerModule,
        RouterTestingModule,
        NgxsModule,
        FormsModule,
        ScrollEventModule,
        NgxsModule.forRoot([ CategoryState, FilterState, NewsState, LogState, OnlineState ]),

      ],
      providers: [
        CategoryState,
        NgStore.Store, NgStore.StateStream, NgStore.ɵo,
        NgStore.ɵm, NgStore.ɵg, NgStore.ɵl, NgStore.ɵp, NgStore.ɵj
       ]

    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'marty-news'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('marty-news');
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#title').textContent).toContain('Marty News');
  }));
});
