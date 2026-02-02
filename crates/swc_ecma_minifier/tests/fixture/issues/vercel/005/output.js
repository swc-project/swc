export default function(value, options) {
    try {
        if ("string" == typeof value && value.length > 0) {
            var str = value;
            if ((str = String(str)).length > 100) throw Error("Value exceeds the maximum length of 100 characters.");
            let match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
            if (!match) return NaN;
            let n = parseFloat(match[1]), type = (match[2] || "ms").toLowerCase();
            switch(type){
                case "years":
                case "year":
                case "yrs":
                case "yr":
                case "y":
                    return 31557600000 * n;
                case "weeks":
                case "week":
                case "w":
                    return 604800000 * n;
                case "days":
                case "day":
                case "d":
                    return 86400000 * n;
                case "hours":
                case "hour":
                case "hrs":
                case "hr":
                case "h":
                    return 3600000 * n;
                case "minutes":
                case "minute":
                case "mins":
                case "min":
                case "m":
                    return 60000 * n;
                case "seconds":
                case "second":
                case "secs":
                case "sec":
                case "s":
                    return 1000 * n;
                case "milliseconds":
                case "millisecond":
                case "msecs":
                case "msec":
                case "ms":
                    return n;
                default:
                    throw Error(`The unit ${type} was matched, but no matching case exists.`);
            }
        }
        if ("number" == typeof value && isFinite(value)) {
            let msAbs, msAbs1;
            return options?.long ? (msAbs = Math.abs(value)) >= 86400000 ? plural(value, msAbs, 86400000, "day") : msAbs >= 3600000 ? plural(value, msAbs, 3600000, "hour") : msAbs >= 60000 ? plural(value, msAbs, 60000, "minute") : msAbs >= 1000 ? plural(value, msAbs, 1000, "second") : `${value} ms` : (msAbs1 = Math.abs(value)) >= 86400000 ? `${Math.round(value / 86400000)}d` : msAbs1 >= 3600000 ? `${Math.round(value / 3600000)}h` : msAbs1 >= 60000 ? `${Math.round(value / 60000)}m` : msAbs1 >= 1000 ? `${Math.round(value / 1000)}s` : `${value}ms`;
        }
        throw Error("Value is not a string or number.");
    } catch (error) {
        throw Error("object" == typeof error && null !== error && "message" in error ? `${error.message}. value=${JSON.stringify(value)}` : "An unknown error has occured.");
    }
};
function plural(ms, msAbs, n, name) {
    return `${Math.round(ms / n)} ${name}${msAbs >= 1.5 * n ? "s" : ""}`;
}
