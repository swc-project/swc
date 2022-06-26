var a = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/, b = /([A-Z])/g;
function c(a, b, c, d) {
    if (!jQuery.acceptData(a)) {
        return;
    }
    var e, f, g = jQuery.expando, h = typeof b === "string", i = a.nodeType, j = i ? jQuery.cache : a, k = i ? a[g] : a[g] && g;
    if ((!k || !j[k] || (!d && !j[k].data)) && h && c === undefined) {
        return;
    }
    if (!k) {
        if (i) {
            a[g] = k = core_deletedIds.pop() || jQuery.guid++;
        } else {
            k = g;
        }
    }
    if (!j[k]) {
        j[k] = {};
        if (!i) {
            j[k].toJSON = jQuery.noop;
        }
    }
    if (typeof b === "object" || typeof b === "function") {
        if (d) {
            j[k] = jQuery.extend(j[k], b);
        } else {
            j[k].data = jQuery.extend(j[k].data, b);
        }
    }
    e = j[k];
    if (!d) {
        if (!e.data) {
            e.data = {};
        }
        e = e.data;
    }
    if (c !== undefined) {
        e[jQuery.camelCase(b)] = c;
    }
    if (h) {
        f = e[b];
        if (f == null) {
            f = e[jQuery.camelCase(b)];
        }
    } else {
        f = e;
    }
    return f;
}
