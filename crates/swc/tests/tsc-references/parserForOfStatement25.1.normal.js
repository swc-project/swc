//// [parserForOfStatement25.ts]
// repro from https://github.com/microsoft/TypeScript/issues/54769
for (let [x = 'a' in {}] of [
    []
])console.log(x);
for (let { x = 'a' in {} } of [
    {}
])console.log(x);
