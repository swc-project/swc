var e = 3600000, s = 24 * e, a = 7 * s, c = 365.25 * s;
export default function(n, t) {
    var o, u, i, h, m;
    try {
        if ("string" == typeof n && n.length > 0) return function(r) {
            if ((r = String(r)).length > 100) throw Error("Value exceeds the maximum length of 100 characters.");
            var n = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(r);
            if (!n) return NaN;
            var t = parseFloat(n[1]), o = (n[2] || "ms").toLowerCase();
            switch(o){
                case "years":
                case "year":
                case "yrs":
                case "yr":
                case "y":
                    return t * c;
                case "weeks":
                case "week":
                case "w":
                    return t * a;
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
        }(n);
        if ("number" == typeof n && isFinite(n)) {
            return (null == t ? void 0 : t.long) ? (o = n, u = Math.abs(o), u >= s ? r(o, u, s, "day") : u >= e ? r(o, u, e, "hour") : u >= 60000 ? r(o, u, 60000, "minute") : u >= 1000 ? r(o, u, 1000, "second") : "".concat(o, " ms")) : (i = n, h = Math.abs(i), h >= s ? "".concat(Math.round(i / s), "d") : h >= e ? "".concat(Math.round(i / e), "h") : h >= 60000 ? "".concat(Math.round(i / 60000), "m") : h >= 1000 ? "".concat(Math.round(i / 1000), "s") : "".concat(i, "ms"));
        }
        throw Error("Value is not a string or number.");
    } catch (d) {
        throw Error((m = d, "object" == typeof m && null !== m && "message" in m) ? "".concat(d.message, ". value=").concat(JSON.stringify(n)) : "An unknown error has occurred.");
    }
};
function r(e, s, a, c) {
    return "".concat(Math.round(e / a), " ").concat(c).concat(s >= 1.5 * a ? "s" : "");
}
