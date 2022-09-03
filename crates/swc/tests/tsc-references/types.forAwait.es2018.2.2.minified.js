//// [types.forAwait.es2018.2.ts]
async function f() {
    let y, z;
    for await (let x of {});
    for await (y of {});
    for await (z of asyncIterable);
    for await (z of iterable);
    for (let x1 of asyncIterable);
    for (y of asyncIterable);
}
