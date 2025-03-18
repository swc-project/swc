import { _ as e } from "@swc/helpers/_/_type_of";
var s = 86400000 * 7;
export default function(c, r) {
    var n, t, o, u, i;
    try {
        if ("string" == typeof c && c.length > 0) return function(e) {
            if ((e = String(e)).length > 100) throw Error("Value exceeds the maximum length of 100 characters.");
            var a = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(e);
            if (!a) return NaN;
            var c = parseFloat(a[1]), r = (a[2] || "ms").toLowerCase();
            switch(r){
                case "years":
                case "year":
                case "yrs":
                case "yr":
                case "y":
                    return 31557600000 * c;
                case "weeks":
                case "week":
                case "w":
                    return c * s;
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
                    throw Error("The unit ".concat(r, " was matched, but no matching case exists."));
            }
        }(c);
        if ("number" == typeof c && isFinite(c)) {
            return (null == r ? void 0 : r.long) ? (n = c, (t = Math.abs(n)) >= 86400000 ? a(n, t, 86400000, "day") : t >= 3600000 ? a(n, t, 3600000, "hour") : t >= 60000 ? a(n, t, 60000, "minute") : t >= 1000 ? a(n, t, 1000, "second") : "".concat(n, " ms")) : (o = c, (u = Math.abs(o)) >= 86400000 ? "".concat(Math.round(o / 86400000), "d") : u >= 3600000 ? "".concat(Math.round(o / 3600000), "h") : u >= 60000 ? "".concat(Math.round(o / 60000), "m") : u >= 1000 ? "".concat(Math.round(o / 1000), "s") : "".concat(o, "ms"));
        }
        throw Error("Value is not a string or number.");
    } catch (s) {
        throw Error((void 0 === (i = s) ? "undefined" : e(i)) === "object" && null !== i && "message" in i ? "".concat(s.message, ". value=").concat(JSON.stringify(c)) : "An unknown error has occurred.");
    }
}
function a(e, s, a, c) {
    return "".concat(Math.round(e / a), " ").concat(c).concat(s >= 1.5 * a ? "s" : "");
}
