import { _ as e } from "@swc/helpers/_/_type_of";
var s = 60000, r = 3600000, c = 86400000, a = 604800000, n = 31557600000;
export default function(o, u) {
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
                    return o * a;
                case "days":
                case "day":
                case "d":
                    return o * c;
                case "hours":
                case "hour":
                case "hrs":
                case "hr":
                case "h":
                    return o * r;
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
        if ("number" == typeof o && isFinite(o)) return (null == u ? void 0 : u.long) ? function(e) {
            var a = Math.abs(e);
            return a >= c ? t(e, a, c, "day") : a >= r ? t(e, a, r, "hour") : a >= s ? t(e, a, s, "minute") : a >= 1000 ? t(e, a, 1000, "second") : "".concat(e, " ms");
        }(o) : function(e) {
            var a = Math.abs(e);
            return a >= c ? "".concat(Math.round(e / c), "d") : a >= r ? "".concat(Math.round(e / r), "h") : a >= s ? "".concat(Math.round(e / s), "m") : a >= 1000 ? "".concat(Math.round(e / 1000), "s") : "".concat(e, "ms");
        }(o);
        throw Error("Value is not a string or number.");
    } catch (s) {
        throw Error(function(s) {
            return (void 0 === s ? "undefined" : e(s)) === "object" && null !== s && "message" in s;
        }(s) ? "".concat(s.message, ". value=").concat(JSON.stringify(o)) : "An unknown error has occurred.");
    }
};
function t(e, s, r, c) {
    return "".concat(Math.round(e / r), " ").concat(c).concat(s >= 1.5 * r ? "s" : "");
}
