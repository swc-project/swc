export default function(c, e) {
    try {
        if ("string" == typeof c && c.length > 0) return (function(a) {
            if ((a = String(a)).length > 100) throw new Error("Value exceeds the maximum length of 100 characters.");
            var b = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(a);
            if (!b) return NaN;
            var c = parseFloat(b[1]), d = (b[2] || "ms").toLowerCase();
            switch(d){
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
                    throw new Error("The unit ".concat(d, " was matched, but no matching case exists."));
            }
        })(c);
        if ("number" == typeof c && isFinite(c)) return (null == e ? void 0 : e.long) ? b(c) : a(c);
        throw new Error("Value is not a string or number.");
    } catch (f) {
        var g = d(f) ? "".concat(f.message, ". value=").concat(JSON.stringify(c)) : "An unknown error has occured.";
        throw new Error(g);
    }
};
function a(a) {
    var b = Math.abs(a);
    return b >= 86400000 ? "".concat(Math.round(a / 86400000), "d") : b >= 3600000 ? "".concat(Math.round(a / 3600000), "h") : b >= 60000 ? "".concat(Math.round(a / 60000), "m") : b >= 1000 ? "".concat(Math.round(a / 1000), "s") : "".concat(a, "ms");
}
function b(a) {
    var b = Math.abs(a);
    return b >= 86400000 ? c(a, b, 86400000, "day") : b >= 3600000 ? c(a, b, 3600000, "hour") : b >= 60000 ? c(a, b, 60000, "minute") : b >= 1000 ? c(a, b, 1000, "second") : "".concat(a, " ms");
}
function c(a, b, c, d) {
    return "".concat(Math.round(a / c), " ").concat(d).concat(b >= 1.5 * c ? "s" : "");
}
function d(a) {
    return "object" == typeof a && null !== a && "message" in a;
}
