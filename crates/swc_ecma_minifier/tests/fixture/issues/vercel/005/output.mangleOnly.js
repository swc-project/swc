const e = 1000;
const s = e * 60;
const n = s * 60;
const r = n * 24;
const c = r * 7;
const t = r * 365.25;
function a(e, s) {
    try {
        if (typeof e === "string" && e.length > 0) {
            return o(e);
        } else if (typeof e === "number" && isFinite(e)) {
            return s?.long ? i(e) : u(e);
        }
        throw new Error("Value is not a string or number.");
    } catch (n) {
        const r = d(n) ? `${n.message}. value=${JSON.stringify(e)}` : "An unknown error has occured.";
        throw new Error(r);
    }
}
function o(a) {
    a = String(a);
    if (a.length > 100) {
        throw new Error("Value exceeds the maximum length of 100 characters.");
    }
    const o = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(a);
    if (!o) {
        return NaN;
    }
    const u = parseFloat(o[1]);
    const i = (o[2] || "ms").toLowerCase();
    switch(i){
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
            return u * t;
        case "weeks":
        case "week":
        case "w":
            return u * c;
        case "days":
        case "day":
        case "d":
            return u * r;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
            return u * n;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
            return u * s;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
            return u * e;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
            return u;
        default:
            throw new Error(`The unit ${i} was matched, but no matching case exists.`);
    }
}
export default a;
function u(c) {
    const t = Math.abs(c);
    if (t >= r) {
        return `${Math.round(c / r)}d`;
    }
    if (t >= n) {
        return `${Math.round(c / n)}h`;
    }
    if (t >= s) {
        return `${Math.round(c / s)}m`;
    }
    if (t >= e) {
        return `${Math.round(c / e)}s`;
    }
    return `${c}ms`;
}
function i(c) {
    const t = Math.abs(c);
    if (t >= r) {
        return m(c, t, r, "day");
    }
    if (t >= n) {
        return m(c, t, n, "hour");
    }
    if (t >= s) {
        return m(c, t, s, "minute");
    }
    if (t >= e) {
        return m(c, t, e, "second");
    }
    return `${c} ms`;
}
function m(e, s, n, r) {
    const c = s >= n * 1.5;
    return `${Math.round(e / n)} ${r}${c ? "s" : ""}`;
}
function d(e) {
    return typeof e === "object" && e !== null && "message" in e;
}
