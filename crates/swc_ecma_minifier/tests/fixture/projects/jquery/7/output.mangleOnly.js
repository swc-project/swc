export const obj = {
    proxy: function(i, n) {
        var t, u, o;
        if (typeof n === "string") {
            o = i[n];
            n = i;
            i = o;
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
