jQuery.extend = jQuery.fn.extend = function() {
    var i, e, f, n, t, s, l = arguments[0] || {}, r = 1, a = arguments.length, o = false;
    if (typeof l === "boolean") {
        o = l;
        l = arguments[1] || {};
        r = 2;
    }
    if (typeof l !== "object" && !jQuery.isFunction(l)) {
        l = {};
    }
    if (a === r) {
        l = this;
        --r;
    }
    for(; r < a; r++){
        if ((t = arguments[r]) != null) {
            for(n in t){
                i = l[n];
                f = t[n];
                if (l === f) {
                    continue;
                }
                if (o && f && (jQuery.isPlainObject(f) || (e = jQuery.isArray(f)))) {
                    if (e) {
                        e = false;
                        s = i && jQuery.isArray(i) ? i : [];
                    } else {
                        s = i && jQuery.isPlainObject(i) ? i : {};
                    }
                    l[n] = jQuery.extend(o, s, f);
                } else if (f !== undefined) {
                    l[n] = f;
                }
            }
        }
    }
    return l;
};
