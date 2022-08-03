export const obj = {
    when: function(e) {
        var i = 0, n = core_slice.call(arguments), o = n.length, r = o !== 1 || (e && jQuery.isFunction(e.promise)) ? o : 0, t = r === 1 ? e : jQuery.Deferred(), s = function(e, i, n) {
            return function(o) {
                i[e] = this;
                n[e] = arguments.length > 1 ? core_slice.call(arguments) : o;
                if (n === f) {
                    t.notifyWith(i, n);
                } else if (!--r) {
                    t.resolveWith(i, n);
                }
            };
        }, f, l, c;
        if (o > 1) {
            f = new Array(o);
            l = new Array(o);
            c = new Array(o);
            for(; i < o; i++){
                if (n[i] && jQuery.isFunction(n[i].promise)) {
                    n[i].promise().done(s(i, c, n)).fail(t.reject).progress(s(i, l, f));
                } else {
                    --r;
                }
            }
        }
        if (!r) {
            t.resolveWith(c, n);
        }
        return t.promise();
    }
};
