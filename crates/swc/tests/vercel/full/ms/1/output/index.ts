var e = 3600000, s = 24 * e, c = 7 * s, n = 365.25 * s;
export default function(t, u) {
    try {
        if ("string" == typeof t && t.length > 0) return function a(r) {
            if ((r = String(r)).length > 100) throw Error("Value exceeds the maximum length of 100 characters.");
            var t = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(r);
            if (!t) return NaN;
            var o = parseFloat(t[1]), u = (t[2] || "ms").toLowerCase();
            switch(u){
                case "years":
                case "year":
                case "yrs":
                case "yr":
                case "y":
                    return o * n;
                case "weeks":
                case "week":
                case "w":
                    return o * c;
                case "days":
                case "day":
                case "d":
                    return o * s;
                case "hours":
                case "hour":
                case "hrs":
                case "hr":
                case "h":
                    return o * e;
                case "minutes":
                case "minute":
                case "mins":
                case "min":
                case "m":
                    return 60000 * o;
                case "seconds":
                case "second":
                case "secs":
                case "sec":
                case "s":
                    return 1000 * o;
                case "milliseconds":
                case "millisecond":
                case "msecs":
                case "msec":
                case "ms":
                    return o;
                default:
                    throw Error("The unit ".concat(u, " was matched, but no matching case exists."));
            }
        }(t);
        if ("number" == typeof t && isFinite(t)) return (null == u ? void 0 : u.long) ? r(t) : a(t);
        throw Error("Value is not a string or number.");
    } catch ($) {
        throw Error(o($) ? "".concat($.message, ". value=").concat(JSON.stringify(t)) : "An unknown error has occurred.");
    }
};
function a(c) {
    var n = Math.abs(c);
    return n >= s ? "".concat(Math.round(c / s), "d") : n >= e ? "".concat(Math.round(c / e), "h") : n >= 60000 ? "".concat(Math.round(c / 60000), "m") : n >= 1000 ? "".concat(Math.round(c / 1000), "s") : "".concat(c, "ms");
}
function r(c) {
    var n = Math.abs(c);
    return n >= s ? t(c, n, s, "day") : n >= e ? t(c, n, e, "hour") : n >= 60000 ? t(c, n, 60000, "minute") : n >= 1000 ? t(c, n, 1000, "second") : "".concat(c, " ms");
}
function t(e, s, c, n) {
    return "".concat(Math.round(e / c), " ").concat(n).concat(s >= 1.5 * c ? "s" : "");
}
function o(e) {
    return "object" == typeof e && null !== e && "message" in e;
}
