//// [generatorReturnTypeInferenceNonStrict.ts]
function* g000() {}
function* g001() {
    yield;
}
function* g002() {
    yield 1;
}
function* g003() {
    yield* [];
}
function* g004() {
    yield* iterableIterator;
}
function* g005() {
    yield* generator;
}
function* g006() {
    yield 1, yield 2;
}
function* g007() {
    yield never;
}
function* g102() {
    return 1;
}
function* g103() {
    return Math.random() ? 1 : 2;
}
function* g104() {
    return never;
}
function* g201() {
    yield 1;
}
function* g202() {
    yield 1, yield 2;
}
function* g203() {
    f1((yield 1));
}
function* g204() {
    f2((yield 1));
}
function* g301() {
    yield;
}
function* g302() {
    yield 1;
}
function* g303() {
    return yield, "a";
}
function* g304() {
    return yield 1, "a";
}
function* g305() {
    return (Math.random() && (yield 1), yield 2, Math.random()) ? "a" : "b";
}
function* g306() {
    return yield 1, !0;
}
function* g307() {
    let a = yield 0;
    return a;
}
function* g308(x) {
    let a = yield x;
    return a;
}
function* g309(x, y) {
    return yield x, y;
}
function* g310() {
    let [a = 1, b = 2] = yield;
}
function* g311() {
    yield* function*() {
        yield;
    }();
}
