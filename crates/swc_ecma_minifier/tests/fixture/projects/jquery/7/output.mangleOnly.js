export const obj = {
    proxy: function(i, n) {
        var t, u, r;
        if (typeof n === "string") {
            r = i[n];
            n = i;
            i = r;
        }
        if (!jQuery.isFunction(i)) {
            return undefined;
        }
        t = core_slice.call(arguments, 2);
        u = function() {
            return i.apply(n || this, t.concat(core_slice.call(arguments)));
        };
        u.guid = i.guid = i.guid || jQuery.guid++;
        return u;
    }
};
