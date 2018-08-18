import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { tap } from 'rxjs/operators';
import { FilterComponent } from './filter.component';
import { FilterState } from '../state/filter.state';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import * as fromFilters from './../reducers';
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
        StoreModule.forRoot({...fromFilters.reducers}),
      ],
      providers: []
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

  it('default - expect trump and sanders filters', () => {
    component.getAllFilters.pipe(
      tap (filter => {
        expect(filter).toEqual(new Set(['trump', 'sanders']));
      })
    ).subscribe();
  });

  it('default - expect display two filters', () => {
    const filterNodes = fixture.nativeElement.querySelectorAll('h3');
    const filters = Array.from(filterNodes);
    expect(filters.length).toEqual(2);
  });

  it('expect remove button should call "removeFilter" method',  async(() => {
    spyOn(component, 'removeFilter');
    const button = fixture.debugElement.nativeElement.querySelector('button[aria-label="Remove filter"]');
    button.click();
      fixture.whenStable().then(() => {
        expect(component.removeFilter).toHaveBeenCalled();
      });

    })
  );
  it('expect add button should call "addFilter" method',  async(() => {
    spyOn(component, 'addFilter');
    const button = fixture.debugElement.nativeElement.querySelector('button[aria-label="Add filter"]');
    button.click();
      fixture.whenStable().then(() => {
        expect(component.addFilter).toHaveBeenCalled();
      });

    })
  );

});

