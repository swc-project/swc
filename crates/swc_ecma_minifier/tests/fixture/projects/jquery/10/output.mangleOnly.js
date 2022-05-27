export const obj = {
    when: function(d) {
        var a = 0, c = core_slice.call(arguments), b = c.length, e = b !== 1 || (d && jQuery.isFunction(d.promise)) ? b : 0, f = e === 1 ? d : jQuery.Deferred(), h = function(a, b, c) {
            return function(d) {
                b[a] = this;
                c[a] = arguments.length > 1 ? core_slice.call(arguments) : d;
                if (c === i) {
                    f.notifyWith(b, c);
                } else if (!--e) {
                    f.resolveWith(b, c);
                }
            };
        }, i, j, g;
        if (b > 1) {
            i = new Array(b);
            j = new Array(b);
            g = new Array(b);
            for(; a < b; a++){
                if (c[a] && jQuery.isFunction(c[a].promise)) {
                    c[a].promise().done(h(a, g, c)).fail(f.reject).progress(h(a, j, i));
                } else {
                    --e;
                }
            }
        }
        if (!e) {
            f.resolveWith(g, c);
        }
        return f.promise();
    }
};
