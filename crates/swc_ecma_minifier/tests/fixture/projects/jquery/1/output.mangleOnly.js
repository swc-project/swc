export const obj = {
    init: function(e, t, i) {
        var r, n;
        if (!e) {
            return this;
        }
        if (typeof e === "string") {
            if (e.charAt(0) === "<" && e.charAt(e.length - 1) === ">" && e.length >= 3) {
                r = [
                    null,
                    e,
                    null
                ];
            } else {
                r = rquickExpr.exec(e);
            }
            if (r && (r[1] || !t)) {
                if (r[1]) {
                    t = t instanceof jQuery ? t[0] : t;
                    jQuery.merge(this, jQuery.parseHTML(r[1], t && t.nodeType ? t.ownerDocument || t : document, true));
                    if (rsingleTag.test(r[1]) && jQuery.isPlainObject(t)) {
                        for(r in t){
                            if (jQuery.isFunction(this[r])) {
                                this[r](t[r]);
                            } else {
                                this.attr(r, t[r]);
                            }
                        }
                    }
                    return this;
                } else {
                    n = document.getElementById(r[2]);
                    if (n && n.parentNode) {
                        if (n.id !== r[2]) {
                            return i.find(e);
                        }
                        this.length = 1;
                        this[0] = n;
                    }
                    this.context = document;
                    this.selector = e;
                    return this;
                }
            } else if (!t || t.jquery) {
                return (t || i).find(e);
            } else {
                return this.constructor(t).find(e);
            }
        } else if (e.nodeType) {
            this.context = this[0] = e;
            this.length = 1;
            return this;
        } else if (jQuery.isFunction(e)) {
            return i.ready(e);
        }
        if (e.selector !== undefined) {
            this.selector = e.selector;
            this.context = e.context;
        }
        return jQuery.makeArray(e, this);
    }
};
