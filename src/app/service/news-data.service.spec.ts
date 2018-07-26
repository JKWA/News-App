import { TestBed, inject } from '@angular/core/testing';

import { NewsDataService } from './news-data.service';

describe('NewsDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewsDataService]
    });
  });

  it('should be created', inject([NewsDataService], (service: NewsDataService) => {
    expect(service).toBeTruthy();
  }));
});
