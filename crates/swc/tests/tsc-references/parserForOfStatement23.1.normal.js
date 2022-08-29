//// [parserForOfStatement23.ts]
async function foo(x) {
    var async;
    for await (async of x){}
}
