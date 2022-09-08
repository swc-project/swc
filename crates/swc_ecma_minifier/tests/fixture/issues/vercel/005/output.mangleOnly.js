const e = 1000;
const s = e * 60;
const r = s * 60;
const n = r * 24;
const t = n * 7;
const c = n * 365.25;
function a(e, s) {
    try {
        if (typeof e === "string" && e.length > 0) {
            return o(e);
        } else if (typeof e === "number" && isFinite(e)) {
            return s?.long ? i(e) : u(e);
        }
        throw new Error("Value is not a string or number.");
    } catch (n) {
        const r = m(n) ? `${n.message}. value=${JSON.stringify(e)}` : "An unknown error has occured.";
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
            return u * c;
        case "weeks":
        case "week":
        case "w":
            return u * t;
        case "days":
        case "day":
        case "d":
            return u * n;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
            return u * r;
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
function u(t) {
    const c = Math.abs(t);
    if (c >= n) {
        return `${Math.round(t / n)}d`;
    }
    if (c >= r) {
        return `${Math.round(t / r)}h`;
    }
    if (c >= s) {
        return `${Math.round(t / s)}m`;
    }
    if (c >= e) {
        return `${Math.round(t / e)}s`;
    }
    return `${t}ms`;
}
function i(t) {
    const c = Math.abs(t);
    if (c >= n) {
        return h(t, c, n, "day");
    }
    if (c >= r) {
        return h(t, c, r, "hour");
    }
    if (c >= s) {
        return h(t, c, s, "minute");
    }
    if (c >= e) {
        return h(t, c, e, "second");
    }
    return `${t} ms`;
}
function h(e, s, r, n) {
    const t = s >= r * 1.5;
    return `${Math.round(e / r)} ${n}${t ? "s" : ""}`;
}
function m(e) {
    return typeof e === "object" && e !== null && "message" in e;
}
