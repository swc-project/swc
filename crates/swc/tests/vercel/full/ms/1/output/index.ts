var e = 31557600000;
export default function(a, c) {
    try {
        if ("string" == typeof a && a.length > 0) return function(s) {
            if ((s = String(s)).length > 100) throw Error("Value exceeds the maximum length of 100 characters.");
            var a = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(s);
            if (!a) return NaN;
            var c = parseFloat(a[1]), r = (a[2] || "ms").toLowerCase();
            switch(r){
                case "years":
                case "year":
                case "yrs":
                case "yr":
                case "y":
                    return c * e;
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
                    throw Error("The unit ".concat(r, " was matched, but no matching case exists."));
            }
        }(a);
        if ("number" == typeof a && isFinite(a)) {
            var r, n, t, o;
            return (null == c ? void 0 : c.long) ? (r = a, (n = Math.abs(r)) >= 86400000 ? s(r, n, 86400000, "day") : n >= 3600000 ? s(r, n, 3600000, "hour") : n >= 60000 ? s(r, n, 60000, "minute") : n >= 1000 ? s(r, n, 1000, "second") : "".concat(r, " ms")) : (t = a, (o = Math.abs(t)) >= 86400000 ? "".concat(Math.round(t / 86400000), "d") : o >= 3600000 ? "".concat(Math.round(t / 3600000), "h") : o >= 60000 ? "".concat(Math.round(t / 60000), "m") : o >= 1000 ? "".concat(Math.round(t / 1000), "s") : "".concat(t, "ms"));
        }
        throw Error("Value is not a string or number.");
    } catch (h) {
        var u, i = "object" == typeof (u = h) && null !== u && "message" in u ? "".concat(h.message, ". value=").concat(JSON.stringify(a)) : "An unknown error has occurred.";
        throw Error(i);
    }
};
function s(e, s, a, c) {
    return "".concat(Math.round(e / a), " ").concat(c).concat(s >= 1.5 * a ? "s" : "");
}
