import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { FilterComponent } from './filter.component';
import { FilterState } from '../state/filter.state';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as NgStore from '@ngxs/store';
import { NgxsModule } from '@ngxs/store';
import {
  MatIconModule,
  MatInputModule,
  } from '@angular/material';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterComponent ],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatIconModule,
        MatInputModule,
        NgxsModule.forRoot([ FilterState ]),
      ],
      providers: [
        NgStore.Store, NgStore.StateStream, NgStore.ɵo,
        NgStore.ɵm, NgStore.ɵg, NgStore.ɵl, NgStore.ɵp, NgStore.ɵj
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('expect default trump and sanders filters', () => {
    console.log();
    component.filters.pipe(
      // tap (filter => console.log(filter)),
      tap (filter => {
        expect(filter).toEqual(new Set(['trump', 'sanders']));
      })
    ).subscribe();
  });

  it('expect display two filters', () => {
    const filterNodes = fixture.nativeElement.querySelectorAll('h3');
    const filters = Array.from(filterNodes);
    expect(filters.length).toEqual(2);
  });

  // });


});

