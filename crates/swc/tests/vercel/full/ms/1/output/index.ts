import { _ as e } from "@swc/helpers/_/_type_of";
export default function(a, c) {
    try {
        if ("string" == typeof a && a.length > 0) {
            var r, n, t, o, u, i = a;
            if ((i = String(i)).length > 100) throw Error("Value exceeds the maximum length of 100 characters.");
            var h = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(i);
            if (!h) return NaN;
            var m = parseFloat(h[1]), d = (h[2] || "ms").toLowerCase();
            switch(d){
                case "years":
                case "year":
                case "yrs":
                case "yr":
                case "y":
                    return 31557600000 * m;
                case "weeks":
                case "week":
                case "w":
                    return 604800000 * m;
                case "days":
                case "day":
                case "d":
                    return 86400000 * m;
                case "hours":
                case "hour":
                case "hrs":
                case "hr":
                case "h":
                    return 3600000 * m;
                case "minutes":
                case "minute":
                case "mins":
                case "min":
                case "m":
                    return 60000 * m;
                case "seconds":
                case "second":
                case "secs":
                case "sec":
                case "s":
                    return 1000 * m;
                case "milliseconds":
                case "millisecond":
                case "msecs":
                case "msec":
                case "ms":
                    return m;
                default:
                    throw Error("The unit ".concat(d, " was matched, but no matching case exists."));
            }
        }
        if ("number" == typeof a && isFinite(a)) {
            return (null == c ? void 0 : c.long) ? (n = a, (t = Math.abs(n)) >= 86400000 ? s(n, t, 86400000, "day") : t >= 3600000 ? s(n, t, 3600000, "hour") : t >= 60000 ? s(n, t, 60000, "minute") : t >= 1000 ? s(n, t, 1000, "second") : "".concat(n, " ms")) : (o = a, (u = Math.abs(o)) >= 86400000 ? "".concat(Math.round(o / 86400000), "d") : u >= 3600000 ? "".concat(Math.round(o / 3600000), "h") : u >= 60000 ? "".concat(Math.round(o / 60000), "m") : u >= 1000 ? "".concat(Math.round(o / 1000), "s") : "".concat(o, "ms"));
        }
        throw Error("Value is not a string or number.");
    } catch (s) {
        throw Error((void 0 === (r = s) ? "undefined" : e(r)) === "object" && null !== r && "message" in r ? "".concat(s.message, ". value=").concat(JSON.stringify(a)) : "An unknown error has occurred.");
    }
};
function s(e, s, a, c) {
    return "".concat(Math.round(e / a), " ").concat(c).concat(s >= 1.5 * a ? "s" : "");
}
