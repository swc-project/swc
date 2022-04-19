var a = 86400000, b = 7 * a, c = 365.25 * a;
export default function(f, h) {
    try {
        if ("string" == typeof f && f.length > 0) return function(e) {
            if ((e = String(e)).length > 100) throw new Error("Value exceeds the maximum length of 100 characters.");
            var f = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(e);
            if (!f) return NaN;
            var d = parseFloat(f[1]), g = (f[2] || "ms").toLowerCase();
            switch(g){
                case "years":
                case "year":
                case "yrs":
                case "yr":
                case "y":
                    return d * c;
                case "weeks":
                case "week":
                case "w":
                    return d * b;
                case "days":
                case "day":
                case "d":
                    return d * a;
                case "hours":
                case "hour":
                case "hrs":
                case "hr":
                case "h":
                    return 3600000 * d;
                case "minutes":
                case "minute":
                case "mins":
                case "min":
                case "m":
                    return 60000 * d;
                case "seconds":
                case "second":
                case "secs":
                case "sec":
                case "s":
                    return 1000 * d;
                case "milliseconds":
                case "millisecond":
                case "msecs":
                case "msec":
                case "ms":
                    return d;
                default:
                    throw new Error("The unit ".concat(g, " was matched, but no matching case exists."));
            }
        }(f);
        if ("number" == typeof f && isFinite(f)) return (null == h ? void 0 : h.long) ? e(f) : d(f);
        throw new Error("Value is not a string or number.");
    } catch (i) {
        var j = g(i) ? "".concat(i.message, ". value=").concat(JSON.stringify(f)) : "An unknown error has occurred.";
        throw new Error(j);
    }
};
function d(b) {
    var c = Math.abs(b);
    return c >= a ? "".concat(Math.round(b / a), "d") : c >= 3600000 ? "".concat(Math.round(b / 3600000), "h") : c >= 60000 ? "".concat(Math.round(b / 60000), "m") : c >= 1000 ? "".concat(Math.round(b / 1000), "s") : "".concat(b, "ms");
}
function e(c) {
    var b = Math.abs(c);
    return b >= a ? f(c, b, a, "day") : b >= 3600000 ? f(c, b, 3600000, "hour") : b >= 60000 ? f(c, b, 60000, "minute") : b >= 1000 ? f(c, b, 1000, "second") : "".concat(c, " ms");
}
function f(b, c, a, d) {
    return "".concat(Math.round(b / a), " ").concat(d).concat(c >= 1.5 * a ? "s" : "");
}
function g(a) {
    return "object" == typeof a && null !== a && "message" in a;
}
