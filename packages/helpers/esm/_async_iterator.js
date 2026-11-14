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
    // `s` is the sync iterator to close when the value of an unfinished result rejects.
    // `return` does not pass it, as in the spec's `closeOnRejection`.
    function AsyncFromSyncIteratorContinuation(r, s) {
        if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object."));

        var done = r.done;

        return Promise.resolve(r.value).then(
            function(value) {
                return { value: value, done: done };
            },
            done || !s ? void 0 : function(error) {
                // Close the sync iterator and keep the original rejection reason.
                try {
                    var ret = s.return;

                    if (null != ret) ret.call(s);
                } catch (e) {}

                throw error;
            }
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
                        var r = ret.call(this.s);

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
