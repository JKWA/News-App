import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StandaloneComponent } from './standalone.component';
import {
  MatIconModule
  } from '@angular/material';

describe('StandaloneComponent', () => {
  let component: StandaloneComponent;
  let fixture: ComponentFixture<StandaloneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandaloneComponent ],
      imports: [
        MatIconModule
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandaloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create standalone component', () => {
    expect(component).toBeTruthy();
  });
});
