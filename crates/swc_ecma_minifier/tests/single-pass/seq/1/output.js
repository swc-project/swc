var MS_PER_MINUTE = 60000, MS_PER_HOUR = 60 * MS_PER_MINUTE, MS_PER_400_YEARS = 3506328 * MS_PER_HOUR;
export function mod$1(dividend, divisor) {
    return (dividend % divisor + divisor) % divisor;
}
export function localStartOfDate(y, m, d) {
    return y < 100 && y >= 0 ? new Date(y + 400, m, d) - MS_PER_400_YEARS : new Date(y, m, d).valueOf();
}
export function utcStartOfDate(y, m, d) {
    return y < 100 && y >= 0 ? Date.UTC(y + 400, m, d) - MS_PER_400_YEARS : Date.UTC(y, m, d);
}
export function startOf(units) {
    var time, startOfDate;
    if (void 0 === (units = normalizeUnits(units)) || 'millisecond' === units || !this.isValid()) return this;
    switch(startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate, units){
        case 'year':
            time = startOfDate(this.year(), 0, 1);
            break;
        case 'quarter':
            time = startOfDate(this.year(), this.month() - this.month() % 3, 1);
            break;
        case 'month':
            time = startOfDate(this.year(), this.month(), 1);
            break;
        case 'week':
            time = startOfDate(this.year(), this.month(), this.date() - this.weekday());
            break;
        case 'isoWeek':
            time = startOfDate(this.year(), this.month(), this.date() - (this.isoWeekday() - 1));
            break;
        case 'day':
        case 'date':
            time = startOfDate(this.year(), this.month(), this.date());
            break;
        case 'hour':
            time = this._d.valueOf(), time -= mod$1(time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE), MS_PER_HOUR);
            break;
        case 'minute':
            time = this._d.valueOf(), time -= mod$1(time, MS_PER_MINUTE);
            break;
        case 'second':
            time = this._d.valueOf(), time -= mod$1(time, 1000);
    }
    return this._d.setTime(time), hooks.updateOffset(this, !0), this;
}
export function endOf(units) {
    var time, startOfDate;
    if (void 0 === (units = normalizeUnits(units)) || 'millisecond' === units || !this.isValid()) return this;
    switch(startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate, units){
        case 'year':
            time = startOfDate(this.year() + 1, 0, 1) - 1;
            break;
        case 'quarter':
            time = startOfDate(this.year(), this.month() - this.month() % 3 + 3, 1) - 1;
            break;
        case 'month':
            time = startOfDate(this.year(), this.month() + 1, 1) - 1;
            break;
        case 'week':
            time = startOfDate(this.year(), this.month(), this.date() - this.weekday() + 7) - 1;
            break;
        case 'isoWeek':
            time = startOfDate(this.year(), this.month(), this.date() - (this.isoWeekday() - 1) + 7) - 1;
            break;
        case 'day':
        case 'date':
            time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
            break;
        case 'hour':
            time = this._d.valueOf(), time += MS_PER_HOUR - mod$1(time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE), MS_PER_HOUR) - 1;
            break;
        case 'minute':
            time = this._d.valueOf(), time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
            break;
        case 'second':
            time = this._d.valueOf(), time += 1000 - mod$1(time, 1000) - 1;
    }
    return this._d.setTime(time), hooks.updateOffset(this, !0), this;
}
export function valueOf() {
    return this._d.valueOf() - 60000 * (this._offset || 0);
}
export function unix() {
    return Math.floor(this.valueOf() / 1000);
}
export function toDate() {
    return new Date(this.valueOf());
}
console.log(MS_PER_400_YEARS);
