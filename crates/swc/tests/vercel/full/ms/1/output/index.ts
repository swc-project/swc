var b = 60000, c = 60 * b, a = 24 * c, d = 7 * a, e = 365.25 * a;
function f(g) {
    if ((g = String(g)).length > 100) throw new Error("Value exceeds the maximum length of 100 characters.");
    var h = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(g);
    if (!h) return NaN;
    var f = parseFloat(h[1]), i = (h[2] || "ms").toLowerCase();
    switch(i){
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
            return f * e;
        case "weeks":
        case "week":
        case "w":
            return f * d;
        case "days":
        case "day":
        case "d":
            return f * a;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
            return f * c;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
            return f * b;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
            return 1000 * f;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
            return f;
        default:
            throw new Error("The unit ".concat(i, " was matched, but no matching case exists."));
    }
}
export default function e(a, b) {
    try {
        if ("string" == typeof a && a.length > 0) return f(a);
        if ("number" == typeof a && isFinite(a)) return (null == b ? void 0 : b.long) ? h(a) : g(a);
        throw new Error("Value is not a string or number.");
    } catch (c) {
        var d = j(c) ? "".concat(c.message, ". value=").concat(JSON.stringify(a)) : "An unknown error has occurred.";
        throw new Error(d);
    }
};
function g(d) {
    var e = Math.abs(d);
    return e >= a ? "".concat(Math.round(d / a), "d") : e >= c ? "".concat(Math.round(d / c), "h") : e >= b ? "".concat(Math.round(d / b), "m") : e >= 1000 ? "".concat(Math.round(d / 1000), "s") : "".concat(d, "ms");
}
function h(e) {
    var d = Math.abs(e);
    return d >= a ? i(e, d, a, "day") : d >= c ? i(e, d, c, "hour") : d >= b ? i(e, d, b, "minute") : d >= 1000 ? i(e, d, 1000, "second") : "".concat(e, " ms");
}
function i(b, c, a, d) {
    return "".concat(Math.round(b / a), " ").concat(d).concat(c >= 1.5 * a ? "s" : "");
}
function j(a) {
    return "object" == typeof a && null !== a && "message" in a;
}
