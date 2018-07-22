import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Log, LogState, LogStateModel } from '../state/state.log';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {
  logs: Log[] = [];
  @Select(LogState) logState: Observable<LogStateModel>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.logState.subscribe( result => {
      this.logs = result.logs;
    });
  }

}
