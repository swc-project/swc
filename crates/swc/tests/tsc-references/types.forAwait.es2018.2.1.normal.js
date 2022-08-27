//// [types.forAwait.es2018.2.ts]
async function f() {
    let y;
    let z;
    for await (const x of {}){}
    for await (y of {}){}
    for await (z of asyncIterable){}
    for await (z of iterable){}
    for (const x1 of asyncIterable){}
    for (y of asyncIterable){}
}
