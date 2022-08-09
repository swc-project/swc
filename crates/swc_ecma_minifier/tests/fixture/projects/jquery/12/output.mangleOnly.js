var e = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/, a = /([A-Z])/g;
function t(e, a, t, f) {
    if (!jQuery.acceptData(e)) {
        return;
    }
    var i, d, n = jQuery.expando, o = typeof a === "string", p = e.nodeType, r = p ? jQuery.cache : e, c = p ? e[n] : e[n] && n;
    if ((!c || !r[c] || (!f && !r[c].data)) && o && t === undefined) {
        return;
    }
    if (!c) {
        if (p) {
            e[n] = c = core_deletedIds.pop() || jQuery.guid++;
        } else {
            c = n;
        }
    }
    if (!r[c]) {
        r[c] = {};
        if (!p) {
            r[c].toJSON = jQuery.noop;
        }
    }
    if (typeof a === "object" || typeof a === "function") {
        if (f) {
            r[c] = jQuery.extend(r[c], a);
        } else {
            r[c].data = jQuery.extend(r[c].data, a);
        }
    }
    i = r[c];
    if (!f) {
        if (!i.data) {
            i.data = {};
        }
        i = i.data;
    }
    if (t !== undefined) {
        i[jQuery.camelCase(a)] = t;
    }
    if (o) {
        d = i[a];
        if (d == null) {
            d = i[jQuery.camelCase(a)];
        }
    } else {
        d = i;
    }
    return d;
}
