// @target: esnext
// @strictNullChecks: false
// @noImplicitReturns: true
// @noImplicitAny: true
function* g000() {}
// 'yield' iteration type inference
function* g001() {
    yield;
}
function* g002() {
    yield 1;
}
function* g003() {
    // NOTE: In strict mode, `[]` produces the type `never[]`.
    //       In non-strict mode, `[]` produces the type `undefined[]` which is implicitly any.
    yield* [];
}
function* g004() {
    yield* iterableIterator;
}
function* g005() {
    const x = yield* generator;
}
function* g006() {
    yield 1;
    yield 2;
}
function* g007() {
    yield never;
}
// 'return' iteration type inference
function* g102() {
    return 1;
}
function* g103() {
    if (Math.random()) return 1;
    return 2;
}
function* g104() {
    return never;
}
// 'next' iteration type inference
function* g201() {
    let a = yield 1;
}
function* g202() {
    let a = yield 1;
    let b = yield 2;
}
function* g203() {
    const x = f1((yield 1));
}
function* g204() {
    const x = f2((yield 1));
}
// mixed iteration types inference
function* g301() {
    yield;
    return;
}
function* g302() {
    yield 1;
    return;
}
function* g303() {
    yield;
    return "a";
}
function* g304() {
    yield 1;
    return "a";
}
function* g305() {
    if (Math.random()) yield 1;
    yield 2;
    if (Math.random()) return "a";
    return "b";
}
function* g306() {
    const a = yield 1;
    return true;
}
function* g307() {
    const a = yield 0;
    return a;
}
function* g308(x) {
    const a = yield x;
    return a;
}
function* g309(x, y) {
    const a = yield x;
    return y;
}
function* g310() {
    const [a = 1, b = 2] = yield;
}
function* g311() {
    yield* function*() {
        const y = yield;
    }();
}
