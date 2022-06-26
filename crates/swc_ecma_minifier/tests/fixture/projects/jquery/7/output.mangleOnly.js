export const obj = {
    proxy: function(a, b) {
        var c, d, e;
        if (typeof b === "string") {
            e = a[b];
            b = a;
            a = e;
        }
        if (!jQuery.isFunction(a)) {
            return undefined;
        }
        c = core_slice.call(arguments, 2);
        d = function() {
            return a.apply(b || this, c.concat(core_slice.call(arguments)));
        };
        d.guid = a.guid = a.guid || jQuery.guid++;
        return d;
    }
};
