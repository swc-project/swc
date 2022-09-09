export const obj = {
    domManip: function(e, t, r) {
        e = core_concat.apply([], e);
        var i, n, l, a, s, c, o = 0, u = this.length, p = this, f = u - 1, h = e[0], y = jQuery.isFunction(h);
        if (y || !(u <= 1 || typeof h !== "string" || jQuery.support.checkClone || !rchecked.test(h))) {
            return this.each(function(i) {
                var n = p.eq(i);
                if (y) {
                    e[0] = h.call(this, i, t ? n.html() : undefined);
                }
                n.domManip(e, t, r);
            });
        }
        if (u) {
            c = jQuery.buildFragment(e, this[0].ownerDocument, false, this);
            i = c.firstChild;
            if (c.childNodes.length === 1) {
                c = i;
            }
            if (i) {
                t = t && jQuery.nodeName(i, "tr");
                a = jQuery.map(getAll(c, "script"), disableScript);
                l = a.length;
                for(; o < u; o++){
                    n = c;
                    if (o !== f) {
                        n = jQuery.clone(n, true, true);
                        if (l) {
                            jQuery.merge(a, getAll(n, "script"));
                        }
                    }
                    r.call(t && jQuery.nodeName(this[o], "table") ? findOrAppend(this[o], "tbody") : this[o], n, o);
                }
                if (l) {
                    s = a[a.length - 1].ownerDocument;
                    jQuery.map(a, restoreScript);
                    for(o = 0; o < l; o++){
                        n = a[o];
                        if (rscriptType.test(n.type || "") && !jQuery._data(n, "globalEval") && jQuery.contains(s, n)) {
                            if (n.src) {
                                jQuery.ajax({
                                    url: n.src,
                                    type: "GET",
                                    dataType: "script",
                                    async: false,
                                    global: false,
                                    throws: true
                                });
                            } else {
                                jQuery.globalEval((n.text || n.textContent || n.innerHTML || "").replace(rcleanScript, ""));
                            }
                        }
                    }
                }
                c = i = null;
            }
        }
        return this;
    }
};
