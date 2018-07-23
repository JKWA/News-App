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
  logs: Log[] = [];
  @Select(LogState.allMessageLogs) allLogs: Observable<Set<Log>>;
  displayedColumns: string[] = [ 'location', 'message' ];

  constructor(private store: Store) {}

  clearMessages() {
    console.log('clear');
    this.store.dispatch(new ClearLog());
  }
}
