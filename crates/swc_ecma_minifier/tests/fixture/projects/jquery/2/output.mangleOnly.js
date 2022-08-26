jQuery.extend = jQuery.fn.extend = function() {
    var e, i, n, f, t, l, o = arguments[0] || {}, s = 1, r = arguments.length, a = false;
    if (typeof o === "boolean") {
        a = o;
        o = arguments[1] || {};
        s = 2;
    }
    if (typeof o !== "object" && !jQuery.isFunction(o)) {
        o = {};
    }
    if (r === s) {
        o = this;
        --s;
    }
    for(; s < r; s++){
        if ((t = arguments[s]) != null) {
            for(f in t){
                e = o[f];
                n = t[f];
                if (o === n) {
                    continue;
                }
                if (a && n && (jQuery.isPlainObject(n) || (i = jQuery.isArray(n)))) {
                    if (i) {
                        i = false;
                        l = e && jQuery.isArray(e) ? e : [];
                    } else {
                        l = e && jQuery.isPlainObject(e) ? e : {};
                    }
                    o[f] = jQuery.extend(a, l, n);
                } else if (n !== undefined) {
                    o[f] = n;
                }
            }
        }
    }
    return o;
};
