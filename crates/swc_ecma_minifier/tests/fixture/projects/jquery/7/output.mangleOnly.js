export const obj = {
    proxy: function(i, n) {
        var r, e, u;
        if (typeof n === "string") {
            u = i[n];
            n = i;
            i = u;
        }
        if (!jQuery.isFunction(i)) {
            return undefined;
        }
        r = core_slice.call(arguments, 2);
        e = function() {
            return i.apply(n || this, r.concat(core_slice.call(arguments)));
        };
        e.guid = i.guid = i.guid || jQuery.guid++;
        return e;
    }
};
