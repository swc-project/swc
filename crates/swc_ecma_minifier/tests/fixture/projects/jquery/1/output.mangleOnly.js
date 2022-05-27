export const obj = {
    init: function(a, b, e) {
        var c, d;
        if (!a) {
            return this;
        }
        if (typeof a === "string") {
            if (a.charAt(0) === "<" && a.charAt(a.length - 1) === ">" && a.length >= 3) {
                c = [
                    null,
                    a,
                    null
                ];
            } else {
                c = rquickExpr.exec(a);
            }
            if (c && (c[1] || !b)) {
                if (c[1]) {
                    b = b instanceof jQuery ? b[0] : b;
                    jQuery.merge(this, jQuery.parseHTML(c[1], b && b.nodeType ? b.ownerDocument || b : document, true));
                    if (rsingleTag.test(c[1]) && jQuery.isPlainObject(b)) {
                        for(c in b){
                            if (jQuery.isFunction(this[c])) {
                                this[c](b[c]);
                            } else {
                                this.attr(c, b[c]);
                            }
                        }
                    }
                    return this;
                } else {
                    d = document.getElementById(c[2]);
                    if (d && d.parentNode) {
                        if (d.id !== c[2]) {
                            return e.find(a);
                        }
                        this.length = 1;
                        this[0] = d;
                    }
                    this.context = document;
                    this.selector = a;
                    return this;
                }
            } else if (!b || b.jquery) {
                return (b || e).find(a);
            } else {
                return this.constructor(b).find(a);
            }
        } else if (a.nodeType) {
            this.context = this[0] = a;
            this.length = 1;
            return this;
        } else if (jQuery.isFunction(a)) {
            return e.ready(a);
        }
        if (a.selector !== undefined) {
            this.selector = a.selector;
            this.context = a.context;
        }
        return jQuery.makeArray(a, this);
    }
};
