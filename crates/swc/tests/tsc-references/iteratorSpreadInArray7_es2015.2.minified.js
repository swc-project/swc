let _iterator = Symbol.iterator;
(void 0).concat([
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
