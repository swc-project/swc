export const obj = {
    proxy: function (fn, context) {
        var args, proxy, tmp;

        if (typeof context === "string") {
            tmp = fn[context];
            context = fn;
            fn = tmp;
        }

        // Quick check to determine if target is callable, in the spec
        // this throws a TypeError, but we will just return undefined.
        if (!jQuery.isFunction(fn)) {
            return undefined;
        }

        // Simulated bind
        args = core_slice.call(arguments, 2);
        proxy = function () {
            return fn.apply(context || this, args.concat(core_slice.call(arguments)));
        };

        // Set the guid of unique handler to the same of original handler, so it can be removed
        proxy.guid = fn.guid = fn.guid || jQuery.guid++;

        return proxy;
    }
}