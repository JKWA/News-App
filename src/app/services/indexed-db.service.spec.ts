import { TestBed, inject } from '@angular/core/testing';

import { IndexedDbService } from './indexed-db.service';

describe('LocalDbService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IndexedDbService]
    });
  });

  // it('should be created', inject([LocalDbService], (service: LocalDbService) => {
  //   expect(service).toBeTruthy();
  // }));
});
