import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NewsSectionComponent } from './news-section.component';
import { StoreModule } from '@ngrx/store';
import * as fromNewsSection from '../../reducers';
import { SharedModule } from '../../shared/shared.module';
import {
  MatIconModule,
  MatSlideToggle, MatSlideToggleModule,
  } from '@angular/material';


describe('NewsSectionComponent', () => {
  let component: NewsSectionComponent;
  let fixture: ComponentFixture<NewsSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsSectionComponent ],
      imports: [
        MatIconModule,
        MatSlideToggleModule,
        SharedModule,
        StoreModule.forRoot({...fromNewsSection.reducers}),
      ],
      providers: []
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));


  it('should create newsSection component', () => {
    expect(component).toBeTruthy();
  });

  describe('HTML', () => {
    it('expect each toggle should call onClick method', () => {
      const componentDebug = fixture.debugElement;
      spyOn(component, 'onClick');
      const allToggles = componentDebug.queryAll(By.directive(MatSlideToggle));
      allToggles.map(toggle => {
        toggle.triggerEventHandler('change', null);
        expect(component.onClick).toHaveBeenCalled();
      });
    });
  });

});
