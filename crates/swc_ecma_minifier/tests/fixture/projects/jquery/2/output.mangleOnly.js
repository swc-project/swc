jQuery.extend = jQuery.fn.extend = function() {
    var a, b, c, d, e, f, g = arguments[0] || {}, h = 1, i = arguments.length, j = false;
    if (typeof g === "boolean") {
        j = g;
        g = arguments[1] || {};
        h = 2;
    }
    if (typeof g !== "object" && !jQuery.isFunction(g)) {
        g = {};
    }
    if (i === h) {
        g = this;
        --h;
    }
    for(; h < i; h++){
        if ((e = arguments[h]) != null) {
            for(d in e){
                a = g[d];
                c = e[d];
                if (g === c) {
                    continue;
                }
                if (j && c && (jQuery.isPlainObject(c) || (b = jQuery.isArray(c)))) {
                    if (b) {
                        b = false;
                        f = a && jQuery.isArray(a) ? a : [];
                    } else {
                        f = a && jQuery.isPlainObject(a) ? a : {};
                    }
                    g[d] = jQuery.extend(j, f, c);
                } else if (c !== undefined) {
                    g[d] = c;
                }
            }
        }
    }
    return g;
};
