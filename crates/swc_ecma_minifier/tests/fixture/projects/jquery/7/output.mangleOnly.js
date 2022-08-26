export const obj = {
    proxy: function(i, n) {
        var t, r, u;
        if (typeof n === "string") {
            u = i[n];
            n = i;
            i = u;
        }
        if (!jQuery.isFunction(i)) {
            return undefined;
        }
        t = core_slice.call(arguments, 2);
        r = function() {
            return i.apply(n || this, t.concat(core_slice.call(arguments)));
        };
        r.guid = i.guid = i.guid || jQuery.guid++;
        return r;
    }
};
