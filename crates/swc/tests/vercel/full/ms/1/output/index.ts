import { _ as e } from "@swc/helpers/_/_type_of";
export default function(c, a) {
    var r, n, t, o, u;
    try {
        if ("string" == typeof c && c.length > 0) return function(e) {
            if ((e = String(e)).length > 100) throw Error("Value exceeds the maximum length of 100 characters.");
            var s = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(e);
            if (!s) return NaN;
            var c = parseFloat(s[1]), a = (s[2] || "ms").toLowerCase();
            switch(a){
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
                    throw Error("The unit ".concat(a, " was matched, but no matching case exists."));
            }
        }(c);
        if ("number" == typeof c && isFinite(c)) {
            return (null == a ? void 0 : a.long) ? (r = c, (n = Math.abs(r)) >= 86400000 ? s(r, n, 86400000, "day") : n >= 3600000 ? s(r, n, 3600000, "hour") : n >= 60000 ? s(r, n, 60000, "minute") : n >= 1000 ? s(r, n, 1000, "second") : "".concat(r, " ms")) : (t = c, (o = Math.abs(t)) >= 86400000 ? "".concat(Math.round(t / 86400000), "d") : o >= 3600000 ? "".concat(Math.round(t / 3600000), "h") : o >= 60000 ? "".concat(Math.round(t / 60000), "m") : o >= 1000 ? "".concat(Math.round(t / 1000), "s") : "".concat(t, "ms"));
        }
        throw Error("Value is not a string or number.");
    } catch (s) {
        throw Error((void 0 === (u = s) ? "undefined" : e(u)) === "object" && null !== u && "message" in u ? "".concat(s.message, ". value=").concat(JSON.stringify(c)) : "An unknown error has occurred.");
    }
}
function s(e, s, c, a) {
    return "".concat(Math.round(e / c), " ").concat(a).concat(s >= 1.5 * c ? "s" : "");
}
