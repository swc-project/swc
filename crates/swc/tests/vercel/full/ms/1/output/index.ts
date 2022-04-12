export default function(c, e) {
    try {
        if ("string" == typeof c && c.length > 0) return function(b) {
            if ((b = String(b)).length > 100) throw new Error("Value exceeds the maximum length of 100 characters.");
            var c = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(b);
            if (!c) return NaN;
            var a = parseFloat(c[1]), d = (c[2] || "ms").toLowerCase();
            switch(d){
                case "years":
                case "year":
                case "yrs":
                case "yr":
                case "y":
                    return 31557600000 * a;
                case "weeks":
                case "week":
                case "w":
                    return 604800000 * a;
                case "days":
                case "day":
                case "d":
                    return 86400000 * a;
                case "hours":
                case "hour":
                case "hrs":
                case "hr":
                case "h":
                    return 3600000 * a;
                case "minutes":
                case "minute":
                case "mins":
                case "min":
                case "m":
                    return 60000 * a;
                case "seconds":
                case "second":
                case "secs":
                case "sec":
                case "s":
                    return 1000 * a;
                case "milliseconds":
                case "millisecond":
                case "msecs":
                case "msec":
                case "ms":
                    return a;
                default:
                    throw new Error("The unit ".concat(d, " was matched, but no matching case exists."));
            }
        }(c);
        if ("number" == typeof c && isFinite(c)) return (null == e ? void 0 : e.long) ? b(c) : a(c);
        throw new Error("Value is not a string or number.");
    } catch (f) {
        var g = d(f) ? "".concat(f.message, ". value=").concat(JSON.stringify(c)) : "An unknown error has occurred.";
        throw new Error(g);
    }
};
function a(a) {
    var b = Math.abs(a);
    return b >= 86400000 ? "".concat(Math.round(a / 86400000), "d") : b >= 3600000 ? "".concat(Math.round(a / 3600000), "h") : b >= 60000 ? "".concat(Math.round(a / 60000), "m") : b >= 1000 ? "".concat(Math.round(a / 1000), "s") : "".concat(a, "ms");
}
function b(b) {
    var a = Math.abs(b);
    return a >= 86400000 ? c(b, a, 86400000, "day") : a >= 3600000 ? c(b, a, 3600000, "hour") : a >= 60000 ? c(b, a, 60000, "minute") : a >= 1000 ? c(b, a, 1000, "second") : "".concat(b, " ms");
}
function c(b, c, a, d) {
    return "".concat(Math.round(b / a), " ").concat(d).concat(c >= 1.5 * a ? "s" : "");
}
function d(a) {
    return "object" == typeof a && null !== a && "message" in a;
}
