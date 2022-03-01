let _iterator = Symbol.iterator;
[
    0,
    1
].concat([
    ...new class {
        next() {
            return {
                value: Symbol(),
                done: !1
            };
        }
        [_iterator]() {
            return this;
        }
    }
]);
