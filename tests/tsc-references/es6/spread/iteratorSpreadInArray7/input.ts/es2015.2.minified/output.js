var array, tmp = Symbol.iterator;
array.concat([
    ...new class {
        next() {
            return {
                value: Symbol(),
                done: !1
            };
        }
        [tmp]() {
            return this;
        }
    }
]);
