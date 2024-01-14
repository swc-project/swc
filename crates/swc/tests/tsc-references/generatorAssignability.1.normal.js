//// [generatorAssignability.ts]
// spread iterable
[
    ...g1
]; // error
[
    ...g2
]; // ok
// binding pattern over iterable
let [x1] = g1; // error
let [x2] = g2; // ok
// binding rest pattern over iterable
let [...y1] = g1; // error
let [...y2] = g2; // ok
// assignment pattern over iterable
[_1] = g1; // error
[_1] = g2; // ok
// assignment rest pattern over iterable
[..._1] = g1; // error
[..._1] = g2; // ok
// for-of over iterable
for (_1 of g1); // error
for (_1 of g2); // ok
async function asyncfn() {
    // for-await-of over iterable
    for await (_1 of g1); // error
    for await (_1 of g2); // ok
    // for-await-of over asynciterable
    for await (_1 of g4); // error
    for await (_1 of g5); // ok
}
function* f1() {
    // yield* over iterable
    yield* g1; // error
    yield* g3; // ok
}
async function* f2() {
    // yield* over iterable
    yield* g1; // error
    yield* g3; // ok
    // yield* over asynciterable
    yield* g4; // error
    yield* g6; // ok
}
async function f3() {
    const syncGenerator = function*() {
        yield 1;
        yield 2;
    };
    const o = {
        [Symbol.asyncIterator]: syncGenerator
    };
    for await (const x of o){}
}
