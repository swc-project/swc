class StringIterator {
    next() {
        return {
            done: !0,
            value: ""
        };
    }
    [Symbol.iterator]() {
        return this;
    }
}
for (var v of new StringIterator);
