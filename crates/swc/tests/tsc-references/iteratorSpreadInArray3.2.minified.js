//// [iteratorSpreadInArray3.ts]
class SymbolIterator {
    next() {
        return {
            value: Symbol(),
            done: !1
        };
    }
    [Symbol.iterator]() {
        return this;
    }
}
[
    ...[
        0,
        1
    ],
    ...new SymbolIterator
];
