import { _ as e } from "@swc/helpers/_/_type_of";
var s = 86400000 * 7;
export default function(c, r) {
    try {
        if ("string" == typeof c && c.length > 0) {
            var n, t, o, u, i, h = c;
            if ((h = String(h)).length > 100) throw Error("Value exceeds the maximum length of 100 characters.");
            var m = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(h);
            if (!m) return NaN;
            var d = parseFloat(m[1]), l = (m[2] || "ms").toLowerCase();
            switch(l){
                case "years":
                case "year":
                case "yrs":
                case "yr":
                case "y":
                    return 31557600000 * d;
                case "weeks":
                case "week":
                case "w":
                    return d * s;
                case "days":
                case "day":
                case "d":
                    return 86400000 * d;
                case "hours":
                case "hour":
                case "hrs":
                case "hr":
                case "h":
                    return 3600000 * d;
                case "minutes":
                case "minute":
                case "mins":
                case "min":
                case "m":
                    return 60000 * d;
                case "seconds":
                case "second":
                case "secs":
                case "sec":
                case "s":
                    return 1000 * d;
                case "milliseconds":
                case "millisecond":
                case "msecs":
                case "msec":
                case "ms":
                    return d;
                default:
                    throw Error("The unit ".concat(l, " was matched, but no matching case exists."));
            }
        }
        if ("number" == typeof c && isFinite(c)) {
            return (null == r ? void 0 : r.long) ? (t = c, (o = Math.abs(t)) >= 86400000 ? a(t, o, 86400000, "day") : o >= 3600000 ? a(t, o, 3600000, "hour") : o >= 60000 ? a(t, o, 60000, "minute") : o >= 1000 ? a(t, o, 1000, "second") : "".concat(t, " ms")) : (u = c, (i = Math.abs(u)) >= 86400000 ? "".concat(Math.round(u / 86400000), "d") : i >= 3600000 ? "".concat(Math.round(u / 3600000), "h") : i >= 60000 ? "".concat(Math.round(u / 60000), "m") : i >= 1000 ? "".concat(Math.round(u / 1000), "s") : "".concat(u, "ms"));
        }
        throw Error("Value is not a string or number.");
    } catch (s) {
        throw Error((void 0 === (n = s) ? "undefined" : e(n)) === "object" && null !== n && "message" in n ? "".concat(s.message, ". value=").concat(JSON.stringify(c)) : "An unknown error has occurred.");
    }
}
function a(e, s, a, c) {
    return "".concat(Math.round(e / a), " ").concat(c).concat(s >= 1.5 * a ? "s" : "");
}
