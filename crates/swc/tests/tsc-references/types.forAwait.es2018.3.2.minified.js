//// [types.forAwait.es2018.3.ts]
async function f1() {
    let y;
    for await (let x of {});
    for await (y of {});
}
async function* f2() {
    let y;
    for await (let x of {});
    for await (y of {});
}
