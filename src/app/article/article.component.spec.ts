import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as NgStore from '@ngxs/store';
import { NgxsModule } from '@ngxs/store';
import { OnlineState } from '../state/online.state';
import { CategoryState } from '../state/category.state';
import { FilterState } from '../state/filter.state';
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
        MatCardModule,
        MatIconModule,
        MatProgressSpinnerModule,
        ScrollEventModule,
        NgxsModule.forRoot([ CategoryState, FilterState, OnlineState ]),

      ],
      providers: [
        NgStore.Store, NgStore.StateStream, NgStore.ɵo,
        NgStore.ɵm, NgStore.ɵg, NgStore.ɵl, NgStore.ɵp, NgStore.ɵj
       ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
