export const obj = {
    domManip: function(t, e, i) {
        t = core_concat.apply([], t);
        var n, a, l, o, s, r, h = 0, f = this.length, c = this, p = f - 1, u = t[0], m = jQuery.isFunction(u);
        if (m || !(f <= 1 || typeof u !== "string" || jQuery.support.checkClone || !rchecked.test(u))) {
            return this.each(function(n) {
                var a = c.eq(n);
                if (m) {
                    t[0] = u.call(this, n, e ? a.html() : undefined);
                }
                a.domManip(t, e, i);
            });
        }
        if (f) {
            r = jQuery.buildFragment(t, this[0].ownerDocument, false, this);
            n = r.firstChild;
            if (r.childNodes.length === 1) {
                r = n;
            }
            if (n) {
                e = e && jQuery.nodeName(n, "tr");
                o = jQuery.map(getAll(r, "script"), disableScript);
                l = o.length;
                for(; h < f; h++){
                    a = r;
                    if (h !== p) {
                        a = jQuery.clone(a, true, true);
                        if (l) {
                            jQuery.merge(o, getAll(a, "script"));
                        }
                    }
                    i.call(e && jQuery.nodeName(this[h], "table") ? findOrAppend(this[h], "tbody") : this[h], a, h);
                }
                if (l) {
                    s = o[o.length - 1].ownerDocument;
                    jQuery.map(o, restoreScript);
                    for(h = 0; h < l; h++){
                        a = o[h];
                        if (rscriptType.test(a.type || "") && !jQuery._data(a, "globalEval") && jQuery.contains(s, a)) {
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
                r = n = null;
            }
        }
        return this;
    }
};
