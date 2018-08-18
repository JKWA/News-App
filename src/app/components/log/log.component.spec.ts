import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LogComponent } from './log.component';
import { StoreModule } from '@ngrx/store';
import * as fromLog from './../../reducers';
import {
  MatIconModule,
  MatTableModule,
  } from '@angular/material';

describe('LogComponent', () => {
  let component: LogComponent;
  let fixture: ComponentFixture<LogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogComponent ],
      imports: [
        MatIconModule,
        MatTableModule,
        StoreModule.forRoot({...fromLog.reducers}),
      ],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create log component', () => {
    expect(component).toBeTruthy();
  });
});
