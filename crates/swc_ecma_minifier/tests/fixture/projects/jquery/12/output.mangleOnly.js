var e = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/, a = /([A-Z])/g;
function t(e, a, t, f) {
    if (!jQuery.acceptData(e)) {
        return;
    }
    var i, n, o = jQuery.expando, d = typeof a === "string", c = e.nodeType, p = c ? jQuery.cache : e, r = c ? e[o] : e[o] && o;
    if ((!r || !p[r] || (!f && !p[r].data)) && d && t === undefined) {
        return;
    }
    if (!r) {
        if (c) {
            e[o] = r = core_deletedIds.pop() || jQuery.guid++;
        } else {
            r = o;
        }
    }
    if (!p[r]) {
        p[r] = {};
        if (!c) {
            p[r].toJSON = jQuery.noop;
        }
    }
    if (typeof a === "object" || typeof a === "function") {
        if (f) {
            p[r] = jQuery.extend(p[r], a);
        } else {
            p[r].data = jQuery.extend(p[r].data, a);
        }
    }
    i = p[r];
    if (!f) {
        if (!i.data) {
            i.data = {};
        }
        i = i.data;
    }
    if (t !== undefined) {
        i[jQuery.camelCase(a)] = t;
    }
    if (d) {
        n = i[a];
        if (n == null) {
            n = i[jQuery.camelCase(a)];
        }
    } else {
        n = i;
    }
    return n;
}
