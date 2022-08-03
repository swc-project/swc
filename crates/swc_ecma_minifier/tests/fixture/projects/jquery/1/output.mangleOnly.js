export const obj = {
    init: function(t, e, i) {
        var n, r;
        if (!t) {
            return this;
        }
        if (typeof t === "string") {
            if (t.charAt(0) === "<" && t.charAt(t.length - 1) === ">" && t.length >= 3) {
                n = [
                    null,
                    t,
                    null
                ];
            } else {
                n = rquickExpr.exec(t);
            }
            if (n && (n[1] || !e)) {
                if (n[1]) {
                    e = e instanceof jQuery ? e[0] : e;
                    jQuery.merge(this, jQuery.parseHTML(n[1], e && e.nodeType ? e.ownerDocument || e : document, true));
                    if (rsingleTag.test(n[1]) && jQuery.isPlainObject(e)) {
                        for(n in e){
                            if (jQuery.isFunction(this[n])) {
                                this[n](e[n]);
                            } else {
                                this.attr(n, e[n]);
                            }
                        }
                    }
                    return this;
                } else {
                    r = document.getElementById(n[2]);
                    if (r && r.parentNode) {
                        if (r.id !== n[2]) {
                            return i.find(t);
                        }
                        this.length = 1;
                        this[0] = r;
                    }
                    this.context = document;
                    this.selector = t;
                    return this;
                }
            } else if (!e || e.jquery) {
                return (e || i).find(t);
            } else {
                return this.constructor(e).find(t);
            }
        } else if (t.nodeType) {
            this.context = this[0] = t;
            this.length = 1;
            return this;
        } else if (jQuery.isFunction(t)) {
            return i.ready(t);
        }
        if (t.selector !== undefined) {
            this.selector = t.selector;
            this.context = t.context;
        }
        return jQuery.makeArray(t, this);
    }
};
