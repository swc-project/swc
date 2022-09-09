jQuery.extend = jQuery.fn.extend = function() {
    var e, i, n, f, r, t, u = arguments[0] || {}, y = 1, j = arguments.length, l = false;
    if (typeof u === "boolean") {
        l = u;
        u = arguments[1] || {};
        y = 2;
    }
    if (typeof u !== "object" && !jQuery.isFunction(u)) {
        u = {};
    }
    if (j === y) {
        u = this;
        --y;
    }
    for(; y < j; y++){
        if ((r = arguments[y]) != null) {
            for(f in r){
                e = u[f];
                n = r[f];
                if (u === n) {
                    continue;
                }
                if (l && n && (jQuery.isPlainObject(n) || (i = jQuery.isArray(n)))) {
                    if (i) {
                        i = false;
                        t = e && jQuery.isArray(e) ? e : [];
                    } else {
                        t = e && jQuery.isPlainObject(e) ? e : {};
                    }
                    u[f] = jQuery.extend(l, t, n);
                } else if (n !== undefined) {
                    u[f] = n;
                }
            }
        }
    }
    return u;
};
