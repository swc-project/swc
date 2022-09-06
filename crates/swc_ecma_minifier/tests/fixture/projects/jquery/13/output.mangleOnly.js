function e(e, t, a) {
    if (!jQuery.acceptData(e)) {
        return;
    }
    var r, i, u, n = e.nodeType, l = n ? jQuery.cache : e, y = n ? e[jQuery.expando] : jQuery.expando;
    if (!l[y]) {
        return;
    }
    if (t) {
        u = a ? l[y] : l[y].data;
        if (u) {
            if (!jQuery.isArray(t)) {
                if (t in u) {
                    t = [
                        t
                    ];
                } else {
                    t = jQuery.camelCase(t);
                    if (t in u) {
                        t = [
                            t
                        ];
                    } else {
                        t = t.split(" ");
                    }
                }
            } else {
                t = t.concat(jQuery.map(t, jQuery.camelCase));
            }
            for(r = 0, i = t.length; r < i; r++){
                delete u[t[r]];
            }
            if (!(a ? isEmptyDataObject : jQuery.isEmptyObject)(u)) {
                return;
            }
        }
    }
    if (!a) {
        delete l[y].data;
        if (!isEmptyDataObject(l[y])) {
            return;
        }
    }
    if (n) {
        jQuery.cleanData([
            e
        ], true);
    } else if (jQuery.support.deleteExpando || l != l.window) {
        delete l[y];
    } else {
        l[y] = null;
    }
}
