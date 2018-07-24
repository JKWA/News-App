import { Component } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Log, LogState , ClearLog} from '../state/state.log';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})

export class LogComponent {
  @Select(LogState.allMessageLogs) allLogs: Observable<Set<Log>>;
  displayedColumns: string[] = [ 'location', 'message' ];

  constructor(private store: Store) {}

  /**
 * clear all logs from log state
 */
  clearMessages() {
    console.log('clear');
    this.store.dispatch(new ClearLog());
  }
}
