const m = 60000, h = 60 * m, d = 24 * h, w = 7 * d, y = 365.25 * d;
export default function(value, options) {
    try {
        if ('string' == typeof value && value.length > 0) return function(str) {
            if (str.length > 100) throw Error('Value exceeds the maximum length of 100 characters.');
            const match = /^(?<value>-?(?:\d+)?\.?\d+) *(?<type>milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str), groups = match?.groups;
            if (!groups) return NaN;
            const n = parseFloat(groups.value), type = (groups.type || 'ms').toLowerCase();
            switch(type){
                case 'years':
                case 'year':
                case 'yrs':
                case 'yr':
                case 'y':
                    return n * y;
                case 'weeks':
                case 'week':
                case 'w':
                    return n * w;
                case 'days':
                case 'day':
                case 'd':
                    return n * d;
                case 'hours':
                case 'hour':
                case 'hrs':
                case 'hr':
                case 'h':
                    return n * h;
                case 'minutes':
                case 'minute':
                case 'mins':
                case 'min':
                case 'm':
                    return n * m;
                case 'seconds':
                case 'second':
                case 'secs':
                case 'sec':
                case 's':
                    return 1000 * n;
                case 'milliseconds':
                case 'millisecond':
                case 'msecs':
                case 'msec':
                case 'ms':
                    return n;
                default:
                    throw Error(`The unit ${type} was matched, but no matching case exists.`);
            }
        }(value);
        if ('number' == typeof value && isFinite(value)) return options?.long ? function(ms) {
            const msAbs = Math.abs(ms);
            return msAbs >= d ? plural(ms, msAbs, d, 'day') : msAbs >= h ? plural(ms, msAbs, h, 'hour') : msAbs >= m ? plural(ms, msAbs, m, 'minute') : msAbs >= 1000 ? plural(ms, msAbs, 1000, 'second') : `${ms} ms`;
        }(value) : function(ms) {
            const msAbs = Math.abs(ms);
            return msAbs >= d ? `${Math.round(ms / d)}d` : msAbs >= h ? `${Math.round(ms / h)}h` : msAbs >= m ? `${Math.round(ms / m)}m` : msAbs >= 1000 ? `${Math.round(ms / 1000)}s` : `${ms}ms`;
        }(value);
        throw Error('Value is not a string or number.');
    } catch (error) {
        const message = function(value) {
            return 'object' == typeof value && null !== value && 'message' in value;
        }(error) ? `${error.message}. value=${JSON.stringify(value)}` : 'An unknown error has occurred.';
        throw Error(message);
    }
};
function plural(ms, msAbs, n, name) {
    return `${Math.round(ms / n)} ${name}${msAbs >= 1.5 * n ? 's' : ''}`;
}
