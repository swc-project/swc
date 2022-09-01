var e = 3600000, s = 24 * e, c = 7 * s, a = 365.25 * s;
export default function(r, t) {
    var o, $, u, i, m;
    try {
        if ("string" == typeof r && r.length > 0) return function(n) {
            if ((n = String(n)).length > 100) throw Error("Value exceeds the maximum length of 100 characters.");
            var r = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(n);
            if (!r) return NaN;
            var t = parseFloat(r[1]), o = (r[2] || "ms").toLowerCase();
            switch(o){
                case "years":
                case "year":
                case "yrs":
                case "yr":
                case "y":
                    return t * a;
                case "weeks":
                case "week":
                case "w":
                    return t * c;
                case "days":
                case "day":
                case "d":
                    return t * s;
                case "hours":
                case "hour":
                case "hrs":
                case "hr":
                case "h":
                    return t * e;
                case "minutes":
                case "minute":
                case "mins":
                case "min":
                case "m":
                    return 60000 * t;
                case "seconds":
                case "second":
                case "secs":
                case "sec":
                case "s":
                    return 1000 * t;
                case "milliseconds":
                case "millisecond":
                case "msecs":
                case "msec":
                case "ms":
                    return t;
                default:
                    throw Error("The unit ".concat(o, " was matched, but no matching case exists."));
            }
        }(r);
        if ("number" == typeof r && isFinite(r)) {
            return (null == t ? void 0 : t.long) ? (o = r, $ = Math.abs(o), $ >= s ? n(o, $, s, "day") : $ >= e ? n(o, $, e, "hour") : $ >= 60000 ? n(o, $, 60000, "minute") : $ >= 1000 ? n(o, $, 1000, "second") : "".concat(o, " ms")) : (u = r, i = Math.abs(u), i >= s ? "".concat(Math.round(u / s), "d") : i >= e ? "".concat(Math.round(u / e), "h") : i >= 60000 ? "".concat(Math.round(u / 60000), "m") : i >= 1000 ? "".concat(Math.round(u / 1000), "s") : "".concat(u, "ms"));
        }
        throw Error("Value is not a string or number.");
    } catch (d) {
        throw Error((m = d, "object" == typeof m && null !== m && "message" in m) ? "".concat(d.message, ". value=").concat(JSON.stringify(r)) : "An unknown error has occurred.");
    }
};
function n(e, s, c, a) {
    return "".concat(Math.round(e / c), " ").concat(a).concat(s >= 1.5 * c ? "s" : "");
}
