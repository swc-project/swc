var a = 3600000, b = 24 * a, c = 7 * b, d = 365.25 * b;
export default function(g, i) {
    try {
        if ("string" == typeof g && g.length > 0) return function e(f) {
            if ((f = String(f)).length > 100) throw Error("Value exceeds the maximum length of 100 characters.");
            var g = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(f);
            if (!g) return NaN;
            var h = parseFloat(g[1]), i = (g[2] || "ms").toLowerCase();
            switch(i){
                case "years":
                case "year":
                case "yrs":
                case "yr":
                case "y":
                    return h * d;
                case "weeks":
                case "week":
                case "w":
                    return h * c;
                case "days":
                case "day":
                case "d":
                    return h * b;
                case "hours":
                case "hour":
                case "hrs":
                case "hr":
                case "h":
                    return h * a;
                case "minutes":
                case "minute":
                case "mins":
                case "min":
                case "m":
                    return 60000 * h;
                case "seconds":
                case "second":
                case "secs":
                case "sec":
                case "s":
                    return 1000 * h;
                case "milliseconds":
                case "millisecond":
                case "msecs":
                case "msec":
                case "ms":
                    return h;
                default:
                    throw Error("The unit ".concat(i, " was matched, but no matching case exists."));
            }
        }(g);
        if ("number" == typeof g && isFinite(g)) return (null == i ? void 0 : i.long) ? f(g) : e(g);
        throw Error("Value is not a string or number.");
    } catch (j) {
        throw Error(h(j) ? "".concat(j.message, ". value=").concat(JSON.stringify(g)) : "An unknown error has occurred.");
    }
};
function e(c) {
    var d = Math.abs(c);
    return d >= b ? "".concat(Math.round(c / b), "d") : d >= a ? "".concat(Math.round(c / a), "h") : d >= 60000 ? "".concat(Math.round(c / 60000), "m") : d >= 1000 ? "".concat(Math.round(c / 1000), "s") : "".concat(c, "ms");
}
function f(c) {
    var d = Math.abs(c);
    return d >= b ? g(c, d, b, "day") : d >= a ? g(c, d, a, "hour") : d >= 60000 ? g(c, d, 60000, "minute") : d >= 1000 ? g(c, d, 1000, "second") : "".concat(c, " ms");
}
function g(a, b, c, d) {
    return "".concat(Math.round(a / c), " ").concat(d).concat(b >= 1.5 * c ? "s" : "");
}
function h(a) {
    return "object" == typeof a && null !== a && "message" in a;
}
