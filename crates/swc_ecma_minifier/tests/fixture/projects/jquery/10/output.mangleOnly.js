export const obj = {
    when: function(e) {
        var i = 0, n = core_slice.call(arguments), r = n.length, o = r !== 1 || (e && jQuery.isFunction(e.promise)) ? r : 0, t = o === 1 ? e : jQuery.Deferred(), s = function(e, i, n) {
            return function(r) {
                i[e] = this;
                n[e] = arguments.length > 1 ? core_slice.call(arguments) : r;
                if (n === f) {
                    t.notifyWith(i, n);
                } else if (!--o) {
                    t.resolveWith(i, n);
                }
            };
        }, f, l, c;
        if (r > 1) {
            f = new Array(r);
            l = new Array(r);
            c = new Array(r);
            for(; i < r; i++){
                if (n[i] && jQuery.isFunction(n[i].promise)) {
                    n[i].promise().done(s(i, c, n)).fail(t.reject).progress(s(i, l, f));
                } else {
                    --o;
                }
            }
        }
        if (!o) {
            t.resolveWith(c, n);
        }
        return t.promise();
    }
};
