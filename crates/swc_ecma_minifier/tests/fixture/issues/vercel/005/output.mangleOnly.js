const a = 1000;
const b = a * 60;
const c = b * 60;
const d = c * 24;
const e = d * 7;
const f = d * 365.25;
function g(a, b) {
    try {
        if (typeof a === "string" && a.length > 0) {
            return h(a);
        } else if (typeof a === "number" && isFinite(a)) {
            return b?.long ? j(a) : i(a);
        }
        throw new Error("Value is not a string or number.");
    } catch (c) {
        const d = l(c) ? `${c.message}. value=${JSON.stringify(a)}` : "An unknown error has occured.";
        throw new Error(d);
    }
}
function h(g) {
    g = String(g);
    if (g.length > 100) {
        throw new Error("Value exceeds the maximum length of 100 characters.");
    }
    const h = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(g);
    if (!h) {
        return NaN;
    }
    const i = parseFloat(h[1]);
    const j = (h[2] || "ms").toLowerCase();
    switch(j){
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
            return i * f;
        case "weeks":
        case "week":
        case "w":
            return i * e;
        case "days":
        case "day":
        case "d":
            return i * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
            return i * c;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
            return i * b;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
            return i * a;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
            return i;
        default:
            throw new Error(`The unit ${j} was matched, but no matching case exists.`);
    }
}
export default g;
function i(e) {
    const f = Math.abs(e);
    if (f >= d) {
        return `${Math.round(e / d)}d`;
    }
    if (f >= c) {
        return `${Math.round(e / c)}h`;
    }
    if (f >= b) {
        return `${Math.round(e / b)}m`;
    }
    if (f >= a) {
        return `${Math.round(e / a)}s`;
    }
    return `${e}ms`;
}
function j(e) {
    const f = Math.abs(e);
    if (f >= d) {
        return k(e, f, d, "day");
    }
    if (f >= c) {
        return k(e, f, c, "hour");
    }
    if (f >= b) {
        return k(e, f, b, "minute");
    }
    if (f >= a) {
        return k(e, f, a, "second");
    }
    return `${e} ms`;
}
function k(a, b, c, d) {
    const e = b >= c * 1.5;
    return `${Math.round(a / c)} ${d}${e ? "s" : ""}`;
}
function l(a) {
    return typeof a === "object" && a !== null && "message" in a;
}
