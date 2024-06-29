import "@swc/helpers/_/_type_of";
import { _ as e } from "@swc/helpers/_/_type_of";
let s = function(s, c) {
    var r, t;
    try {
        if ("string" == typeof s && s.length > 0) return function(e) {
            if ((e = String(e)).length > 100) throw Error("Value exceeds the maximum length of 100 characters.");
            var s = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(e);
            if (!s) return NaN;
            var a = parseFloat(s[1]), c = (s[2] || "ms").toLowerCase();
            switch(c){
                case "years":
                case "year":
                case "yrs":
                case "yr":
                case "y":
                    return 31557600000 * a;
                case "weeks":
                case "week":
                case "w":
                    return 604800000 * a;
                case "days":
                case "day":
                case "d":
                    return 86400000 * a;
                case "hours":
                case "hour":
                case "hrs":
                case "hr":
                case "h":
                    return 3600000 * a;
                case "minutes":
                case "minute":
                case "mins":
                case "min":
                case "m":
                    return 60000 * a;
                case "seconds":
                case "second":
                case "secs":
                case "sec":
                case "s":
                    return 1000 * a;
                case "milliseconds":
                case "millisecond":
                case "msecs":
                case "msec":
                case "ms":
                    return a;
                default:
                    throw Error("The unit ".concat(c, " was matched, but no matching case exists."));
            }
        }(s);
        if ("number" == typeof s && isFinite(s)) return (null == c ? void 0 : c.long) ? (r = Math.abs(s)) >= 86400000 ? a(s, r, 86400000, "day") : r >= 3600000 ? a(s, r, 3600000, "hour") : r >= 60000 ? a(s, r, 60000, "minute") : r >= 1000 ? a(s, r, 1000, "second") : "".concat(s, " ms") : (t = Math.abs(s)) >= 86400000 ? "".concat(Math.round(s / 86400000), "d") : t >= 3600000 ? "".concat(Math.round(s / 3600000), "h") : t >= 60000 ? "".concat(Math.round(s / 60000), "m") : t >= 1000 ? "".concat(Math.round(s / 1000), "s") : "".concat(s, "ms");
        throw Error("Value is not a string or number.");
    } catch (a) {
        throw Error((void 0 === a ? "undefined" : e(a)) === "object" && null !== a && "message" in a ? "".concat(a.message, ". value=").concat(JSON.stringify(s)) : "An unknown error has occurred.");
    }
};
function a(e, s, a, c) {
    return "".concat(Math.round(e / a), " ").concat(c).concat(s >= 1.5 * a ? "s" : "");
}
export { s as default };
