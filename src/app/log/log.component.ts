import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as LogActions from './../actions/log.actions';


import { Observable } from 'rxjs';
import * as fromLog from './../reducers';
import { Log } from '../models/log';


@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})

export class LogComponent {
  displayedColumns: string[] = [ 'location', 'message' ];

  constructor(private store: Store<fromLog.State>) {}

  get getAllLogs(): Observable<Log[]> {
    return this.store.pipe(
      select(fromLog.getAllLogs),
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
