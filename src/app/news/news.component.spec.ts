import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsComponent } from './news.component';
import { ArticleComponent } from '../article/article.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CategoryState } from '../state/category.state';
import { FilterState } from '../state/filter.state';
import * as NgStore from '@ngxs/store';
import { NgxsModule } from '@ngxs/store';
import {
  MatIconModule,
  MatCardModule,
  MatTabsModule,
  MatProgressSpinnerModule,
  } from '@angular/material';
import { ScrollEventModule } from 'ngx-scroll-event';


describe('NewsComponent', () => {
  let component: NewsComponent;
  let fixture: ComponentFixture<NewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsComponent, ArticleComponent ],
      imports: [
        BrowserAnimationsModule,
        MatIconModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatTabsModule,
        NgxsModule.forRoot([ CategoryState, FilterState ]),
        ScrollEventModule
      ],
      providers: [
        NgStore.Store, NgStore.StateStream, NgStore.ɵo,
        NgStore.ɵm, NgStore.ɵg, NgStore.ɵl, NgStore.ɵp, NgStore.ɵj
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
