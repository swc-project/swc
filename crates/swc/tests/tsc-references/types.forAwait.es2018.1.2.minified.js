//// [types.forAwait.es2018.1.ts]
async function f1() {
    let y;
    for await (let x of asyncIterable);
    for await (let x1 of iterable);
    for await (let x2 of iterableOfPromise);
    for await (y of asyncIterable);
    for await (y of iterable);
    for await (y of iterableOfPromise);
}
async function* f2() {
    let y;
    for await (let x of asyncIterable);
    for await (let x1 of iterable);
    for await (let x2 of iterableOfPromise);
    for await (y of asyncIterable);
    for await (y of iterable);
    for await (y of iterableOfPromise);
}
