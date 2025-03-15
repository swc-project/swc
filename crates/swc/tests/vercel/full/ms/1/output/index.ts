import { _ as e } from "@swc/helpers/_/_type_of";
var s = 60 * 1000, a = 60 * 1000 * 60, c = 60 * 1000 * 60 * 24, r = 60 * 1000 * 60 * 24 * 7, n = 60 * 1000 * 60 * 24 * 365.25;
export default function(o, u) {
    var i, h, m, d, l;
    try {
        if ("string" == typeof o && o.length > 0) return function(e) {
            if ((e = String(e)).length > 100) throw Error("Value exceeds the maximum length of 100 characters.");
            var t = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(e);
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
                    return o * r;
                case "days":
                case "day":
                case "d":
                    return o * c;
                case "hours":
                case "hour":
                case "hrs":
                case "hr":
                case "h":
                    return o * a;
                case "minutes":
                case "minute":
                case "mins":
                case "min":
                case "m":
                    return o * s;
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
        }(o);
        if ("number" == typeof o && isFinite(o)) {
            ;
            return (null == u ? void 0 : u.long) ? (i = o, (h = Math.abs(i)) >= c ? t(i, h, c, "day") : h >= a ? t(i, h, a, "hour") : h >= s ? t(i, h, s, "minute") : h >= 1000 ? t(i, h, 1000, "second") : "".concat(i, " ms")) : (m = o, (d = Math.abs(m)) >= c ? "".concat(Math.round(m / c), "d") : d >= a ? "".concat(Math.round(m / a), "h") : d >= s ? "".concat(Math.round(m / s), "m") : d >= 1000 ? "".concat(Math.round(m / 1000), "s") : "".concat(m, "ms"));
        }
        throw Error("Value is not a string or number.");
    } catch (s) {
        ;
        throw Error((void 0 === (l = s) ? "undefined" : e(l)) === "object" && null !== l && "message" in l ? "".concat(s.message, ". value=").concat(JSON.stringify(o)) : "An unknown error has occurred.");
    }
}
function t(e, s, a, c) {
    return "".concat(Math.round(e / a), " ").concat(c).concat(s >= 1.5 * a ? "s" : "");
}
