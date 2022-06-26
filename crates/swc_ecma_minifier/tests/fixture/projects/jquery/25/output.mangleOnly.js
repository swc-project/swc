export const obj = {
    domManip: function(a, b, c) {
        a = core_concat.apply([], a);
        var d, e, f, g, h, i, j = 0, k = this.length, l = this, m = k - 1, n = a[0], o = jQuery.isFunction(n);
        if (o || !(k <= 1 || typeof n !== "string" || jQuery.support.checkClone || !rchecked.test(n))) {
            return this.each(function(d) {
                var e = l.eq(d);
                if (o) {
                    a[0] = n.call(this, d, b ? e.html() : undefined);
                }
                e.domManip(a, b, c);
            });
        }
        if (k) {
            i = jQuery.buildFragment(a, this[0].ownerDocument, false, this);
            d = i.firstChild;
            if (i.childNodes.length === 1) {
                i = d;
            }
            if (d) {
                b = b && jQuery.nodeName(d, "tr");
                g = jQuery.map(getAll(i, "script"), disableScript);
                f = g.length;
                for(; j < k; j++){
                    e = i;
                    if (j !== m) {
                        e = jQuery.clone(e, true, true);
                        if (f) {
                            jQuery.merge(g, getAll(e, "script"));
                        }
                    }
                    c.call(b && jQuery.nodeName(this[j], "table") ? findOrAppend(this[j], "tbody") : this[j], e, j);
                }
                if (f) {
                    h = g[g.length - 1].ownerDocument;
                    jQuery.map(g, restoreScript);
                    for(j = 0; j < f; j++){
                        e = g[j];
                        if (rscriptType.test(e.type || "") && !jQuery._data(e, "globalEval") && jQuery.contains(h, e)) {
                            if (e.src) {
                                jQuery.ajax({
                                    url: e.src,
                                    type: "GET",
                                    dataType: "script",
                                    async: false,
                                    global: false,
                                    throws: true
                                });
                            } else {
                                jQuery.globalEval((e.text || e.textContent || e.innerHTML || "").replace(rcleanScript, ""));
                            }
                        }
                    }
                }
                i = d = null;
            }
        }
        return this;
    }
};
