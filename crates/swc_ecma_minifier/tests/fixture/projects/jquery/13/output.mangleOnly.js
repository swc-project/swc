function a(e, a, g) {
    if (!jQuery.acceptData(e)) {
        return;
    }
    var f, i, d, h = e.nodeType, b = h ? jQuery.cache : e, c = h ? e[jQuery.expando] : jQuery.expando;
    if (!b[c]) {
        return;
    }
    if (a) {
        d = g ? b[c] : b[c].data;
        if (d) {
            if (!jQuery.isArray(a)) {
                if (a in d) {
                    a = [
                        a
                    ];
                } else {
                    a = jQuery.camelCase(a);
                    if (a in d) {
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
            for(f = 0, i = a.length; f < i; f++){
                delete d[a[f]];
            }
            if (!(g ? isEmptyDataObject : jQuery.isEmptyObject)(d)) {
                return;
            }
        }
    }
    if (!g) {
        delete b[c].data;
        if (!isEmptyDataObject(b[c])) {
            return;
        }
    }
    if (h) {
        jQuery.cleanData([
            e
        ], true);
    } else if (jQuery.support.deleteExpando || b != b.window) {
        delete b[c];
    } else {
        b[c] = null;
    }
}
