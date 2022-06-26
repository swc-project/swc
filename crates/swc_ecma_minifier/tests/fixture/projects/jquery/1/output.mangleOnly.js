export const obj = {
    init: function(a, b, c) {
        var d, e;
        if (!a) {
            return this;
        }
        if (typeof a === "string") {
            if (a.charAt(0) === "<" && a.charAt(a.length - 1) === ">" && a.length >= 3) {
                d = [
                    null,
                    a,
                    null
                ];
            } else {
                d = rquickExpr.exec(a);
            }
            if (d && (d[1] || !b)) {
                if (d[1]) {
                    b = b instanceof jQuery ? b[0] : b;
                    jQuery.merge(this, jQuery.parseHTML(d[1], b && b.nodeType ? b.ownerDocument || b : document, true));
                    if (rsingleTag.test(d[1]) && jQuery.isPlainObject(b)) {
                        for(d in b){
                            if (jQuery.isFunction(this[d])) {
                                this[d](b[d]);
                            } else {
                                this.attr(d, b[d]);
                            }
                        }
                    }
                    return this;
                } else {
                    e = document.getElementById(d[2]);
                    if (e && e.parentNode) {
                        if (e.id !== d[2]) {
                            return c.find(a);
                        }
                        this.length = 1;
                        this[0] = e;
                    }
                    this.context = document;
                    this.selector = a;
                    return this;
                }
            } else if (!b || b.jquery) {
                return (b || c).find(a);
            } else {
                return this.constructor(b).find(a);
            }
        } else if (a.nodeType) {
            this.context = this[0] = a;
            this.length = 1;
            return this;
        } else if (jQuery.isFunction(a)) {
            return c.ready(a);
        }
        if (a.selector !== undefined) {
            this.selector = a.selector;
            this.context = a.context;
        }
        return jQuery.makeArray(a, this);
    }
};
