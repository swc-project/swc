export const obj = {
    proxy: function(fn, context) {
        var args, proxy, tmp;
        // Quick check to determine if target is callable, in the spec
        // this throws a TypeError, but we will just return undefined.
        if ("string" == typeof context && (tmp = fn[context], context = fn, fn = tmp), jQuery.isFunction(fn)) return(// Simulated bind
        args = core_slice.call(arguments, 2), // Set the guid of unique handler to the same of original handler, so it can be removed
        (proxy = function() {
            return fn.apply(context || this, args.concat(core_slice.call(arguments)));
        }).guid = fn.guid = fn.guid || jQuery.guid++, proxy);
    }
};
