const e = 1000;
const s = e * 60;
const n = s * 60;
const t = n * 24;
const c = t * 7;
const r = t * 365.25;
function a(e, s) {
    try {
        if (typeof e === "string" && e.length > 0) {
            return u(e);
        } else if (typeof e === "number" && isFinite(e)) {
            return s?.long ? i(e) : o(e);
        }
        throw new Error("Value is not a string or number.");
    } catch (n) {
        const t = d(n) ? `${n.message}. value=${JSON.stringify(e)}` : "An unknown error has occured.";
        throw new Error(t);
    }
}
function u(a) {
    a = String(a);
    if (a.length > 100) {
        throw new Error("Value exceeds the maximum length of 100 characters.");
    }
    const u = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(a);
    if (!u) {
        return NaN;
    }
    const o = parseFloat(u[1]);
    const i = (u[2] || "ms").toLowerCase();
    switch(i){
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
            return o * r;
        case "weeks":
        case "week":
        case "w":
            return o * c;
        case "days":
        case "day":
        case "d":
            return o * t;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
            return o * n;
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
            return o * e;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
            return o;
        default:
            throw new Error(`The unit ${i} was matched, but no matching case exists.`);
    }
}
export default a;
function o(c) {
    const r = Math.abs(c);
    if (r >= t) {
        return `${Math.round(c / t)}d`;
    }
    if (r >= n) {
        return `${Math.round(c / n)}h`;
    }
    if (r >= s) {
        return `${Math.round(c / s)}m`;
    }
    if (r >= e) {
        return `${Math.round(c / e)}s`;
    }
    return `${c}ms`;
}
function i(c) {
    const r = Math.abs(c);
    if (r >= t) {
        return f(c, r, t, "day");
    }
    if (r >= n) {
        return f(c, r, n, "hour");
    }
    if (r >= s) {
        return f(c, r, s, "minute");
    }
    if (r >= e) {
        return f(c, r, e, "second");
    }
    return `${c} ms`;
}
function f(e, s, n, t) {
    const c = s >= n * 1.5;
    return `${Math.round(e / n)} ${t}${c ? "s" : ""}`;
}
function d(e) {
    return typeof e === "object" && e !== null && "message" in e;
}
