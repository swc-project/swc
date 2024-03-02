export default function(s, c) {
    var a, r;
    try {
        if ("string" == typeof s && s.length > 0) return function(e) {
            if ((e = String(e)).length > 100) throw Error("Value exceeds the maximum length of 100 characters.");
            var s = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(e);
            if (!s) return NaN;
            var c = parseFloat(s[1]), a = (s[2] || "ms").toLowerCase();
            switch(a){
                case "years":
                case "year":
                case "yrs":
                case "yr":
                case "y":
                    return 31557600000 * c;
                case "weeks":
                case "week":
                case "w":
                    return 604800000 * c;
                case "days":
                case "day":
                case "d":
                    return 86400000 * c;
                case "hours":
                case "hour":
                case "hrs":
                case "hr":
                case "h":
                    return 3600000 * c;
                case "minutes":
                case "minute":
                case "mins":
                case "min":
                case "m":
                    return 60000 * c;
                case "seconds":
                case "second":
                case "secs":
                case "sec":
                case "s":
                    return 1000 * c;
                case "milliseconds":
                case "millisecond":
                case "msecs":
                case "msec":
                case "ms":
                    return c;
                default:
                    throw Error("The unit ".concat(a, " was matched, but no matching case exists."));
            }
        }(s);
        if ("number" == typeof s && isFinite(s)) return (null == c ? void 0 : c.long) ? (a = Math.abs(s)) >= 86400000 ? e(s, a, 86400000, "day") : a >= 3600000 ? e(s, a, 3600000, "hour") : a >= 60000 ? e(s, a, 60000, "minute") : a >= 1000 ? e(s, a, 1000, "second") : "".concat(s, " ms") : (r = Math.abs(s)) >= 86400000 ? "".concat(Math.round(s / 86400000), "d") : r >= 3600000 ? "".concat(Math.round(s / 3600000), "h") : r >= 60000 ? "".concat(Math.round(s / 60000), "m") : r >= 1000 ? "".concat(Math.round(s / 1000), "s") : "".concat(s, "ms");
        throw Error("Value is not a string or number.");
    } catch (e) {
        throw Error("object" == typeof e && null !== e && "message" in e ? "".concat(e.message, ". value=").concat(JSON.stringify(s)) : "An unknown error has occurred.");
    }
}
function e(e, s, c, a) {
    return "".concat(Math.round(e / c), " ").concat(a).concat(s >= 1.5 * c ? "s" : "");
}
