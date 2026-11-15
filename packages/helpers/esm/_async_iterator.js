function _async_iterator(iterable) {
    var method, async, sync, retry = 2;
    for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) {
        if (async && null != (method = iterable[async])) return method.call(iterable);
        if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable));
        async = "@@asyncIterator", sync = "@@iterator";
    }
    throw new TypeError("Object is not async iterable");
}
function AsyncFromSyncIterator(s) {
    // Calls `fn` with `s` as `this` and the given arguments, like the spec's `Call`,
    // even if `fn` has an own `call` or `apply` property.
    function AsyncFromSyncIteratorCall(fn, s, args) {
        return Function.prototype.apply.call(fn, s, args);
    }

    // Gets the method `key` of `s`, like the spec's `GetMethod`: `null` and `undefined` give `undefined`,
    // and other values that are not callable throw a TypeError.
    function AsyncFromSyncIteratorGetMethod(s, key) {
        var fn = s[key];

        if (null == fn) return;
        if ("function" != typeof fn) throw new TypeError(key + " is not a function");

        return fn;
    }

    // Closes the sync iterator after a rejection. Errors from `return` are ignored,
    // so that the original rejection reason is kept.
    function AsyncFromSyncIteratorClose(s) {
        try {
            var ret = AsyncFromSyncIteratorGetMethod(s, "return");

            if (ret) AsyncFromSyncIteratorCall(ret, s);
        } catch (e) {}
    }

    // `s` is the sync iterator to close when the value of an unfinished result rejects.
    // `return` does not pass it, as in the spec's `closeOnRejection`.
    function AsyncFromSyncIteratorContinuation(r, s) {
        if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object."));

        var done = r.done, value = r.value, closeOnRejection = !done && s, wrapper;

        try {
            wrapper = Promise.resolve(value);
        } catch (e) {
            if (closeOnRejection) AsyncFromSyncIteratorClose(s);

            return Promise.reject(e);
        }

        return wrapper.then(
            function(value) {
                return { value: value, done: done };
            },
            closeOnRejection
                ? function(error) {
                    AsyncFromSyncIteratorClose(s);

                    throw error;
                }
                : void 0
        );
    }

    return AsyncFromSyncIterator = function(s) {
        this.s = s, this.n = s.next;
    },
        AsyncFromSyncIterator.prototype = {
            s: null,
            n: null,

            // Each method returns a rejected promise instead of throwing synchronously,
            // as `%AsyncFromSyncIteratorPrototype%` does.
            next: function() {
                try {
                    return AsyncFromSyncIteratorContinuation(AsyncFromSyncIteratorCall(this.n, this.s, arguments), this.s);
                } catch (e) {
                    return Promise.reject(e);
                }
            },
            return: function(value) {
                try {
                    var ret = AsyncFromSyncIteratorGetMethod(this.s, "return");

                    return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(AsyncFromSyncIteratorCall(ret, this.s, arguments));
                } catch (e) {
                    return Promise.reject(e);
                }
            },
            throw: function(value) {
                try {
                    var thr = AsyncFromSyncIteratorGetMethod(this.s, "throw");

                    if (void 0 === thr) {
                        // The sync iterator cannot handle `throw`, so close it before rejecting,
                        // as `%AsyncFromSyncIteratorPrototype%.throw` does.
                        var ret = AsyncFromSyncIteratorGetMethod(this.s, "return");

                        if (void 0 !== ret) {
                            var r = AsyncFromSyncIteratorCall(ret, this.s);

                            if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object."));
                        }

                        return Promise.reject(new TypeError("The iterator does not provide a 'throw' method"));
                    }

                    return AsyncFromSyncIteratorContinuation(AsyncFromSyncIteratorCall(thr, this.s, arguments), this.s);
                } catch (e) {
                    return Promise.reject(e);
                }
            }
        },
        new AsyncFromSyncIterator(s);
}
export { _async_iterator as _ };
