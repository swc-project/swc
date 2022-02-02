export default function(value, options) {
    try {
        if ("string" == typeof value && value.length > 0) return (function(str) {
            if ((str = String(str)).length > 100) throw new Error("Value exceeds the maximum length of 100 characters.");
            const match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
            if (!match) return NaN;
            const n = parseFloat(match[1]), type = (match[2] || "ms").toLowerCase();
            switch(type){
                case "years":
                case "year":
                case "yrs":
                case "yr":
                case "y":
                    return 315576e5 * n;
                case "weeks":
                case "week":
                case "w":
                    return 6048e5 * n;
                case "days":
                case "day":
                case "d":
                    return 864e5 * n;
                case "hours":
                case "hour":
                case "hrs":
                case "hr":
                case "h":
                    return 36e5 * n;
                case "minutes":
                case "minute":
                case "mins":
                case "min":
                case "m":
                    return 6e4 * n;
                case "seconds":
                case "second":
                case "secs":
                case "sec":
                case "s":
                    return 1e3 * n;
                case "milliseconds":
                case "millisecond":
                case "msecs":
                case "msec":
                case "ms":
                    return n;
                default:
                    throw new Error(`The unit ${type} was matched, but no matching case exists.`);
            }
        })(value);
        if ("number" == typeof value && isFinite(value)) return options?.long ? fmtLong(value) : fmtShort(value);
        throw new Error("Value is not a string or number.");
    } catch (error) {
        const message = isError(error) ? `${error.message}. value=${JSON.stringify(value)}` : "An unknown error has occured.";
        throw new Error(message);
    }
};
function fmtShort(ms) {
    const msAbs = Math.abs(ms);
    return msAbs >= 864e5 ? `${Math.round(ms / 864e5)}d` : msAbs >= 36e5 ? `${Math.round(ms / 36e5)}h` : msAbs >= 6e4 ? `${Math.round(ms / 6e4)}m` : msAbs >= 1e3 ? `${Math.round(ms / 1e3)}s` : `${ms}ms`;
}
function fmtLong(ms) {
    const msAbs = Math.abs(ms);
    return msAbs >= 864e5 ? plural(ms, msAbs, 864e5, "day") : msAbs >= 36e5 ? plural(ms, msAbs, 36e5, "hour") : msAbs >= 6e4 ? plural(ms, msAbs, 6e4, "minute") : msAbs >= 1e3 ? plural(ms, msAbs, 1e3, "second") : `${ms} ms`;
}
function plural(ms, msAbs, n, name) {
    return `${Math.round(ms / n)} ${name}${msAbs >= 1.5 * n ? "s" : ""}`;
}
function isError(error) {
    return "object" == typeof error && null !== error && "message" in error;
}
