const b = 1000;
const c = b * 60;
const d = c * 60;
const a = d * 24;
const f = a * 7;
const g = a * 365.25;
function e(a, c) {
    try {
        if (typeof a === "string" && a.length > 0) {
            return h(a);
        } else if (typeof a === "number" && isFinite(a)) {
            return c?.long ? j(a) : i(a);
        }
        throw new Error("Value is not a string or number.");
    } catch (b) {
        const d = l(b) ? `${b.message}. value=${JSON.stringify(a)}` : "An unknown error has occured.";
        throw new Error(d);
    }
}
function h(h) {
    h = String(h);
    if (h.length > 100) {
        throw new Error("Value exceeds the maximum length of 100 characters.");
    }
    const i = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(h);
    if (!i) {
        return NaN;
    }
    const e = parseFloat(i[1]);
    const j = (i[2] || "ms").toLowerCase();
    switch(j){
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
            return e * g;
        case "weeks":
        case "week":
        case "w":
            return e * f;
        case "days":
        case "day":
        case "d":
            return e * a;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
            return e * d;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
            return e * c;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
            return e * b;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
            return e;
        default:
            throw new Error(`The unit ${j} was matched, but no matching case exists.`);
    }
}
export default e;
function i(e) {
    const f = Math.abs(e);
    if (f >= a) {
        return `${Math.round(e / a)}d`;
    }
    if (f >= d) {
        return `${Math.round(e / d)}h`;
    }
    if (f >= c) {
        return `${Math.round(e / c)}m`;
    }
    if (f >= b) {
        return `${Math.round(e / b)}s`;
    }
    return `${e}ms`;
}
function j(f) {
    const e = Math.abs(f);
    if (e >= a) {
        return k(f, e, a, "day");
    }
    if (e >= d) {
        return k(f, e, d, "hour");
    }
    if (e >= c) {
        return k(f, e, c, "minute");
    }
    if (e >= b) {
        return k(f, e, b, "second");
    }
    return `${f} ms`;
}
function k(b, c, a, d) {
    const e = c >= a * 1.5;
    return `${Math.round(b / a)} ${d}${e ? "s" : ""}`;
}
function l(a) {
    return typeof a === "object" && a !== null && "message" in a;
}
