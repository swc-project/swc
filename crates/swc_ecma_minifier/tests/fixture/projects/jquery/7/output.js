export const obj = {
    proxy: function(fn, context) {
        var args, proxy, tmp;
        if ("string" == typeof context) {
            tmp = fn[context];
            context = fn;
            fn = tmp;
        }
        return jQuery.isFunction(fn) ? (args = core_slice.call(arguments, 2), (proxy = function() {
            return fn.apply(context || this, args.concat(core_slice.call(arguments)));
        }).guid = fn.guid = fn.guid || jQuery.guid++, proxy) : void 0;
    }
};
