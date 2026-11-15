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
    // Calls `fn` with `s` as `this`, like the spec's `Call`, even if `fn` has an own `call` property.
    function AsyncFromSyncIteratorCall(fn, s) {
        return Function.prototype.call.call(fn, s);
    }

    // Closes the sync iterator after a rejection. Errors from `return` are ignored,
    // so that the original rejection reason is kept.
    function AsyncFromSyncIteratorClose(s) {
        try {
            var ret = s.return;

            if (null != ret) AsyncFromSyncIteratorCall(ret, s);
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

            next: function() {
                return AsyncFromSyncIteratorContinuation(
                    this.n.apply(this.s, arguments),
                    this.s
                );
            },
            return: function(value) {
                var ret = this.s.return;

                return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments));
            },
            throw: function(value) {
                var thr = this.s.throw;

                if (null == thr) {
                    // The sync iterator cannot handle `throw`, so close it before rejecting,
                    // as `%AsyncFromSyncIteratorPrototype%.throw` does.
                    var ret = this.s.return;

                    if (null != ret) {
                        var r = AsyncFromSyncIteratorCall(ret, this.s);

                        if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object."));
                    }

                    return Promise.reject(new TypeError("The iterator does not provide a 'throw' method"));
                }

                return AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments), this.s);
            }
        },
        new AsyncFromSyncIterator(s);
}
export { _async_iterator as _ };
