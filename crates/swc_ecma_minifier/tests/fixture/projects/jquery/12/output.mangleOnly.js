var a = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/, b = /([A-Z])/g;
function c(e, d, i, j) {
    if (!jQuery.acceptData(e)) {
        return;
    }
    var c, f, g = jQuery.expando, k = typeof d === "string", h = e.nodeType, b = h ? jQuery.cache : e, a = h ? e[g] : e[g] && g;
    if ((!a || !b[a] || (!j && !b[a].data)) && k && i === undefined) {
        return;
    }
    if (!a) {
        if (h) {
            e[g] = a = core_deletedIds.pop() || jQuery.guid++;
        } else {
            a = g;
        }
    }
    if (!b[a]) {
        b[a] = {};
        if (!h) {
            b[a].toJSON = jQuery.noop;
        }
    }
    if (typeof d === "object" || typeof d === "function") {
        if (j) {
            b[a] = jQuery.extend(b[a], d);
        } else {
            b[a].data = jQuery.extend(b[a].data, d);
        }
    }
    c = b[a];
    if (!j) {
        if (!c.data) {
            c.data = {};
        }
        c = c.data;
    }
    if (i !== undefined) {
        c[jQuery.camelCase(d)] = i;
    }
    if (k) {
        f = c[d];
        if (f == null) {
            f = c[jQuery.camelCase(d)];
        }
    } else {
        f = c;
    }
    return f;
}
