export const obj = {
    when: function(e) {
        var r = 0, i = core_slice.call(arguments), n = i.length, o = n !== 1 || (e && jQuery.isFunction(e.promise)) ? n : 0, t = o === 1 ? e : jQuery.Deferred(), s = function(e, r, i) {
            return function(n) {
                r[e] = this;
                i[e] = arguments.length > 1 ? core_slice.call(arguments) : n;
                if (i === c) {
                    t.notifyWith(r, i);
                } else if (!--o) {
                    t.resolveWith(r, i);
                }
            };
        }, c, l, f;
        if (n > 1) {
            c = new Array(n);
            l = new Array(n);
            f = new Array(n);
            for(; r < n; r++){
                if (i[r] && jQuery.isFunction(i[r].promise)) {
                    i[r].promise().done(s(r, f, i)).fail(t.reject).progress(s(r, l, c));
                } else {
                    --o;
                }
            }
        }
        if (!o) {
            t.resolveWith(f, i);
        }
        return t.promise();
    }
};
