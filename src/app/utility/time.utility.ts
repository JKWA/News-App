import * as moment from 'moment';

export class Time {
    date: moment.Moment;
    logFormat: string;
    sixtyMinutesAgo: string;

    constructor() {
        this.date = moment(new Date());
        this.logFormat = this._logFormat();
        this.sixtyMinutesAgo = this._sixtyMinutesAgo();

    }
    private _logFormat() {
        return this.date.format('LTS');
    }

    private _sixtyMinutesAgo() {
        return this.date.subtract(60, 'm').toISOString();
    }
}
