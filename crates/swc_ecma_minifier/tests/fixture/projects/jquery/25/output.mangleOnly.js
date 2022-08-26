export const obj = {
    domManip: function(t, e, i) {
        t = core_concat.apply([], t);
        var n, l, a, s, r, o, c = 0, h = this.length, f = this, p = h - 1, u = t[0], d = jQuery.isFunction(u);
        if (d || !(h <= 1 || typeof u !== "string" || jQuery.support.checkClone || !rchecked.test(u))) {
            return this.each(function(n) {
                var l = f.eq(n);
                if (d) {
                    t[0] = u.call(this, n, e ? l.html() : undefined);
                }
                l.domManip(t, e, i);
            });
        }
        if (h) {
            o = jQuery.buildFragment(t, this[0].ownerDocument, false, this);
            n = o.firstChild;
            if (o.childNodes.length === 1) {
                o = n;
            }
            if (n) {
                e = e && jQuery.nodeName(n, "tr");
                s = jQuery.map(getAll(o, "script"), disableScript);
                a = s.length;
                for(; c < h; c++){
                    l = o;
                    if (c !== p) {
                        l = jQuery.clone(l, true, true);
                        if (a) {
                            jQuery.merge(s, getAll(l, "script"));
                        }
                    }
                    i.call(e && jQuery.nodeName(this[c], "table") ? findOrAppend(this[c], "tbody") : this[c], l, c);
                }
                if (a) {
                    r = s[s.length - 1].ownerDocument;
                    jQuery.map(s, restoreScript);
                    for(c = 0; c < a; c++){
                        l = s[c];
                        if (rscriptType.test(l.type || "") && !jQuery._data(l, "globalEval") && jQuery.contains(r, l)) {
                            if (l.src) {
                                jQuery.ajax({
                                    url: l.src,
                                    type: "GET",
                                    dataType: "script",
                                    async: false,
                                    global: false,
                                    throws: true
                                });
                            } else {
                                jQuery.globalEval((l.text || l.textContent || l.innerHTML || "").replace(rcleanScript, ""));
                            }
                        }
                    }
                }
                o = n = null;
            }
        }
        return this;
    }
};
