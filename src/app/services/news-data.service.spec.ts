import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { NewsDataService } from './news-data.service';
import { SharedModule } from './../shared/shared.module';


describe('NewsDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ NewsDataService ],
      imports: [
        SharedModule,
        HttpClientModule
      ]
    });
  });

  it('should be created', inject([NewsDataService], (service: NewsDataService) => {
    expect(service).toBeTruthy();
  }));
});
