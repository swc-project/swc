var array;
let _iterator = Symbol.iterator;
array.concat([
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
