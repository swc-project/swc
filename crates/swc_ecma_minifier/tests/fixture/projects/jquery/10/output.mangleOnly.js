export const obj = {
    when: function(a) {
        var b = 0, c = core_slice.call(arguments), d = c.length, e = d !== 1 || (a && jQuery.isFunction(a.promise)) ? d : 0, f = e === 1 ? a : jQuery.Deferred(), g = function(a, b, c) {
            return function(d) {
                b[a] = this;
                c[a] = arguments.length > 1 ? core_slice.call(arguments) : d;
                if (c === h) {
                    f.notifyWith(b, c);
                } else if (!--e) {
                    f.resolveWith(b, c);
                }
            };
        }, h, i, j;
        if (d > 1) {
            h = new Array(d);
            i = new Array(d);
            j = new Array(d);
            for(; b < d; b++){
                if (c[b] && jQuery.isFunction(c[b].promise)) {
                    c[b].promise().done(g(b, j, c)).fail(f.reject).progress(g(b, i, h));
                } else {
                    --e;
                }
            }
        }
        if (!e) {
            f.resolveWith(j, c);
        }
        return f.promise();
    }
};
