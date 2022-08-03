function e(e, a, t) {
    if (!jQuery.acceptData(e)) {
        return;
    }
    var i, n, l, f = e.nodeType, r = f ? jQuery.cache : e, c = f ? e[jQuery.expando] : jQuery.expando;
    if (!r[c]) {
        return;
    }
    if (a) {
        l = t ? r[c] : r[c].data;
        if (l) {
            if (!jQuery.isArray(a)) {
                if (a in l) {
                    a = [
                        a
                    ];
                } else {
                    a = jQuery.camelCase(a);
                    if (a in l) {
                        a = [
                            a
                        ];
                    } else {
                        a = a.split(" ");
                    }
                }
            } else {
                a = a.concat(jQuery.map(a, jQuery.camelCase));
            }
            for(i = 0, n = a.length; i < n; i++){
                delete l[a[i]];
            }
            if (!(t ? isEmptyDataObject : jQuery.isEmptyObject)(l)) {
                return;
            }
        }
    }
    if (!t) {
        delete r[c].data;
        if (!isEmptyDataObject(r[c])) {
            return;
        }
    }
    if (f) {
        jQuery.cleanData([
            e
        ], true);
    } else if (jQuery.support.deleteExpando || r != r.window) {
        delete r[c];
    } else {
        r[c] = null;
    }
}
