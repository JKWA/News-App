import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as LogActions from './../../actions/log.actions';
import { tap, map, concatMap, catchError} from 'rxjs/operators';


import { Observable } from 'rxjs';
import * as fromLog from './../../reducers';
import { Log } from '../../models/log.model';


@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})

export class LogComponent {
  displayedColumns: string[] = [ 'time', 'type', 'number' ];

  constructor(private store: Store<fromLog.State>) {}

  get getAllLogs(): Observable<any> {
    return this.store.pipe(
      select(fromLog.getAllLogs),
      map(result => Array.from(result.values()))
    );
  }

/**
 * clear all logs from log state
 *
 * @memberof LogComponent
 */
clearMessages(): void {
  this.store.dispatch(new LogActions.DeleteAllLogs());
  }
}
