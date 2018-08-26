import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from '../../../testing/in-memory-data.service';
import { StoreModule } from '@ngrx/store';
import * as fromReducers from './../../reducers';

import {
  MatCardModule,
  MatIconModule,
  MatProgressSpinnerModule,
  } from '@angular/material';
  import { ScrollEventModule } from 'ngx-scroll-event';


import { ArticleComponent } from './article.component';

describe('ArticleComponent', () => {
  let component: ArticleComponent;
  let fixture: ComponentFixture<ArticleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleComponent ],
      imports: [
        HttpClientModule,
        ! environment.production
        ? HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService)
        : [],
        MatCardModule,
        MatIconModule,
        MatProgressSpinnerModule,
        ScrollEventModule,
        StoreModule.forRoot({...fromReducers.reducers}),
      ],
      providers: []
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  }));


  it('should create article component', () => {
    expect(component).toBeTruthy();
  });

  describe('Defaults', () => {

    it('expect articles is empty array', () => {
      component.getArticles.pipe(
        tap(articles => {
          expect( articles ).toEqual([]);
        })
      )
      .subscribe();
    });

  });
});
