var b = 3600000, a = 24 * b, c = 7 * a, d = 365.25 * a;
export default function(g, i) {
    try {
        if ("string" == typeof g && g.length > 0) return function i(f) {
            if ((f = String(f)).length > 100) throw new Error("Value exceeds the maximum length of 100 characters.");
            var g = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(f);
            if (!g) return NaN;
            var e = parseFloat(g[1]), h = (g[2] || "ms").toLowerCase();
            switch(h){
                case "years":
                case "year":
                case "yrs":
                case "yr":
                case "y":
                    return e * d;
                case "weeks":
                case "week":
                case "w":
                    return e * c;
                case "days":
                case "day":
                case "d":
                    return e * a;
                case "hours":
                case "hour":
                case "hrs":
                case "hr":
                case "h":
                    return e * b;
                case "minutes":
                case "minute":
                case "mins":
                case "min":
                case "m":
                    return 60000 * e;
                case "seconds":
                case "second":
                case "secs":
                case "sec":
                case "s":
                    return 1000 * e;
                case "milliseconds":
                case "millisecond":
                case "msecs":
                case "msec":
                case "ms":
                    return e;
                default:
                    throw new Error("The unit ".concat(h, " was matched, but no matching case exists."));
            }
        }(g);
        if ("number" == typeof g && isFinite(g)) return (null == i ? void 0 : i.long) ? f(g) : e(g);
        throw new Error("Value is not a string or number.");
    } catch (j) {
        var k = h(j) ? "".concat(j.message, ". value=").concat(JSON.stringify(g)) : "An unknown error has occurred.";
        throw new Error(k);
    }
};
function e(c) {
    var d = Math.abs(c);
    return d >= a ? "".concat(Math.round(c / a), "d") : d >= b ? "".concat(Math.round(c / b), "h") : d >= 60000 ? "".concat(Math.round(c / 60000), "m") : d >= 1000 ? "".concat(Math.round(c / 1000), "s") : "".concat(c, "ms");
}
function f(d) {
    var c = Math.abs(d);
    return c >= a ? g(d, c, a, "day") : c >= b ? g(d, c, b, "hour") : c >= 60000 ? g(d, c, 60000, "minute") : c >= 1000 ? g(d, c, 1000, "second") : "".concat(d, " ms");
}
function g(b, c, a, d) {
    return "".concat(Math.round(b / a), " ").concat(d).concat(c >= 1.5 * a ? "s" : "");
}
function h(a) {
    return "object" == typeof a && null !== a && "message" in a;
}
