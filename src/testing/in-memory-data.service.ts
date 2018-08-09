import { Injectable } from '@angular/core';
import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
import { ParsedRequestUrl, RequestInfoUtilities } from 'angular-in-memory-web-api';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { getResponse } from './mock.response.1';


@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  constructor() { }


  parseRequestUrl(url: string, utils: RequestInfoUtilities): ParsedRequestUrl {
    const parsed = utils.parseRequestUrl(url);
    delete parsed.query;
    return parsed;
  }

  createDb(reqInfo?: RequestInfo) {
    return of({everything: getResponse}).pipe(delay(10));
  }
}

