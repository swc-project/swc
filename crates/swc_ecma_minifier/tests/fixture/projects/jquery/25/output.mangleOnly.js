export const obj = {
    domManip: function(f, i, l) {
        f = core_concat.apply([], f);
        var e, a, g, c, k, d, b = 0, h = this.length, o = this, m = h - 1, j = f[0], n = jQuery.isFunction(j);
        if (n || !(h <= 1 || typeof j !== "string" || jQuery.support.checkClone || !rchecked.test(j))) {
            return this.each(function(a) {
                var b = o.eq(a);
                if (n) {
                    f[0] = j.call(this, a, i ? b.html() : undefined);
                }
                b.domManip(f, i, l);
            });
        }
        if (h) {
            d = jQuery.buildFragment(f, this[0].ownerDocument, false, this);
            e = d.firstChild;
            if (d.childNodes.length === 1) {
                d = e;
            }
            if (e) {
                i = i && jQuery.nodeName(e, "tr");
                c = jQuery.map(getAll(d, "script"), disableScript);
                g = c.length;
                for(; b < h; b++){
                    a = d;
                    if (b !== m) {
                        a = jQuery.clone(a, true, true);
                        if (g) {
                            jQuery.merge(c, getAll(a, "script"));
                        }
                    }
                    l.call(i && jQuery.nodeName(this[b], "table") ? findOrAppend(this[b], "tbody") : this[b], a, b);
                }
                if (g) {
                    k = c[c.length - 1].ownerDocument;
                    jQuery.map(c, restoreScript);
                    for(b = 0; b < g; b++){
                        a = c[b];
                        if (rscriptType.test(a.type || "") && !jQuery._data(a, "globalEval") && jQuery.contains(k, a)) {
                            if (a.src) {
                                jQuery.ajax({
                                    url: a.src,
                                    type: "GET",
                                    dataType: "script",
                                    async: false,
                                    global: false,
                                    throws: true
                                });
                            } else {
                                jQuery.globalEval((a.text || a.textContent || a.innerHTML || "").replace(rcleanScript, ""));
                            }
                        }
                    }
                }
                d = e = null;
            }
        }
        return this;
    }
};
