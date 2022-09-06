var e = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/, a = /([A-Z])/g;
function t(e, a, t, f) {
    if (!jQuery.acceptData(e)) {
        return;
    }
    var i, r, d = jQuery.expando, n = typeof a === "string", u = e.nodeType, o = u ? jQuery.cache : e, y = u ? e[d] : e[d] && d;
    if ((!y || !o[y] || (!f && !o[y].data)) && n && t === undefined) {
        return;
    }
    if (!y) {
        if (u) {
            e[d] = y = core_deletedIds.pop() || jQuery.guid++;
        } else {
            y = d;
        }
    }
    if (!o[y]) {
        o[y] = {};
        if (!u) {
            o[y].toJSON = jQuery.noop;
        }
    }
    if (typeof a === "object" || typeof a === "function") {
        if (f) {
            o[y] = jQuery.extend(o[y], a);
        } else {
            o[y].data = jQuery.extend(o[y].data, a);
        }
    }
    i = o[y];
    if (!f) {
        if (!i.data) {
            i.data = {};
        }
        i = i.data;
    }
    if (t !== undefined) {
        i[jQuery.camelCase(a)] = t;
    }
    if (n) {
        r = i[a];
        if (r == null) {
            r = i[jQuery.camelCase(a)];
        }
    } else {
        r = i;
    }
    return r;
}
