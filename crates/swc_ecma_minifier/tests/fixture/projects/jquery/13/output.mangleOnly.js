function a(a, b, c) {
    if (!jQuery.acceptData(a)) {
        return;
    }
    var d, e, f, g = a.nodeType, h = g ? jQuery.cache : a, i = g ? a[jQuery.expando] : jQuery.expando;
    if (!h[i]) {
        return;
    }
    if (b) {
        f = c ? h[i] : h[i].data;
        if (f) {
            if (!jQuery.isArray(b)) {
                if (b in f) {
                    b = [
                        b
                    ];
                } else {
                    b = jQuery.camelCase(b);
                    if (b in f) {
                        b = [
                            b
                        ];
                    } else {
                        b = b.split(" ");
                    }
                }
            } else {
                b = b.concat(jQuery.map(b, jQuery.camelCase));
            }
            for(d = 0, e = b.length; d < e; d++){
                delete f[b[d]];
            }
            if (!(c ? isEmptyDataObject : jQuery.isEmptyObject)(f)) {
                return;
            }
        }
    }
    if (!c) {
        delete h[i].data;
        if (!isEmptyDataObject(h[i])) {
            return;
        }
    }
    if (g) {
        jQuery.cleanData([
            a
        ], true);
    } else if (jQuery.support.deleteExpando || h != h.window) {
        delete h[i];
    } else {
        h[i] = null;
    }
}
