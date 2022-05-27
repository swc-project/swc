jQuery.extend = jQuery.fn.extend = function() {
    var c, f, b, e, g, h, a = arguments[0] || {}, d = 1, j = arguments.length, i = false;
    if (typeof a === "boolean") {
        i = a;
        a = arguments[1] || {};
        d = 2;
    }
    if (typeof a !== "object" && !jQuery.isFunction(a)) {
        a = {};
    }
    if (j === d) {
        a = this;
        --d;
    }
    for(; d < j; d++){
        if ((g = arguments[d]) != null) {
            for(e in g){
                c = a[e];
                b = g[e];
                if (a === b) {
                    continue;
                }
                if (i && b && (jQuery.isPlainObject(b) || (f = jQuery.isArray(b)))) {
                    if (f) {
                        f = false;
                        h = c && jQuery.isArray(c) ? c : [];
                    } else {
                        h = c && jQuery.isPlainObject(c) ? c : {};
                    }
                    a[e] = jQuery.extend(i, h, b);
                } else if (b !== undefined) {
                    a[e] = b;
                }
            }
        }
    }
    return a;
};
