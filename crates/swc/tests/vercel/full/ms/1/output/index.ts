var c = 3600000, e = 24 * c, a = 7 * e, s = 365.25 * e;
export default function(t, o) {
    try {
        if ("string" == typeof t && t.length > 0) return function n(r) {
            if ((r = String(r)).length > 100) throw Error("Value exceeds the maximum length of 100 characters.");
            var t = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(r);
            if (!t) return NaN;
            var $ = parseFloat(t[1]), o = (t[2] || "ms").toLowerCase();
            switch(o){
                case "years":
                case "year":
                case "yrs":
                case "yr":
                case "y":
                    return $ * s;
                case "weeks":
                case "week":
                case "w":
                    return $ * a;
                case "days":
                case "day":
                case "d":
                    return $ * e;
                case "hours":
                case "hour":
                case "hrs":
                case "hr":
                case "h":
                    return $ * c;
                case "minutes":
                case "minute":
                case "mins":
                case "min":
                case "m":
                    return 60000 * $;
                case "seconds":
                case "second":
                case "secs":
                case "sec":
                case "s":
                    return 1000 * $;
                case "milliseconds":
                case "millisecond":
                case "msecs":
                case "msec":
                case "ms":
                    return $;
                default:
                    throw Error("The unit ".concat(o, " was matched, but no matching case exists."));
            }
        }(t);
        if ("number" == typeof t && isFinite(t)) return (null == o ? void 0 : o.long) ? r(t) : n(t);
        throw Error("Value is not a string or number.");
    } catch (u) {
        throw Error($(u) ? "".concat(u.message, ". value=").concat(JSON.stringify(t)) : "An unknown error has occurred.");
    }
};
function n(a) {
    var s = Math.abs(a);
    return s >= e ? "".concat(Math.round(a / e), "d") : s >= c ? "".concat(Math.round(a / c), "h") : s >= 60000 ? "".concat(Math.round(a / 60000), "m") : s >= 1000 ? "".concat(Math.round(a / 1000), "s") : "".concat(a, "ms");
}
function r(a) {
    var s = Math.abs(a);
    return s >= e ? t(a, s, e, "day") : s >= c ? t(a, s, c, "hour") : s >= 60000 ? t(a, s, 60000, "minute") : s >= 1000 ? t(a, s, 1000, "second") : "".concat(a, " ms");
}
function t(c, e, a, s) {
    return "".concat(Math.round(c / a), " ").concat(s).concat(e >= 1.5 * a ? "s" : "");
}
function $(c) {
    return "object" == typeof c && null !== c && "message" in c;
}
