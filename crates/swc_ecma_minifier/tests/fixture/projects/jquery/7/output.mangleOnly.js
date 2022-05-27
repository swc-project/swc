export const obj = {
    proxy: function(a, b) {
        var e, c, d;
        if (typeof b === "string") {
            d = a[b];
            b = a;
            a = d;
        }
        if (!jQuery.isFunction(a)) {
            return undefined;
        }
        e = core_slice.call(arguments, 2);
        c = function() {
            return a.apply(b || this, e.concat(core_slice.call(arguments)));
        };
        c.guid = a.guid = a.guid || jQuery.guid++;
        return c;
    }
};
