import { _ as e } from "@swc/helpers/_/_type_of";
export default function(c, a) {
    var r, n;
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
        if ("number" == typeof c && isFinite(c)) return (null == a ? void 0 : a.long) ? (r = Math.abs(c)) >= 86400000 ? s(c, r, 86400000, "day") : r >= 3600000 ? s(c, r, 3600000, "hour") : r >= 60000 ? s(c, r, 60000, "minute") : r >= 1000 ? s(c, r, 1000, "second") : "".concat(c, " ms") : (n = Math.abs(c)) >= 86400000 ? "".concat(Math.round(c / 86400000), "d") : n >= 3600000 ? "".concat(Math.round(c / 3600000), "h") : n >= 60000 ? "".concat(Math.round(c / 60000), "m") : n >= 1000 ? "".concat(Math.round(c / 1000), "s") : "".concat(c, "ms");
        throw Error("Value is not a string or number.");
    } catch (s) {
        throw Error((void 0 === s ? "undefined" : e(s)) === "object" && null !== s && "message" in s ? "".concat(s.message, ". value=").concat(JSON.stringify(c)) : "An unknown error has occurred.");
    }
}
function s(e, s, c, a) {
    return "".concat(Math.round(e / c), " ").concat(a).concat(s >= 1.5 * c ? "s" : "");
}
