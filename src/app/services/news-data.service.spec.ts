import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { NewsDataService } from './news-data.service';

describe('NewsDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ NewsDataService ],
      imports: [
        HttpClientModule
      ]
    });
  });

  it('should be created', inject([NewsDataService], (service: NewsDataService) => {
    expect(service).toBeTruthy();
  }));
});
