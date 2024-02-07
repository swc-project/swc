//// [parserForOfStatement25.ts]
for (let [x = 'a' in {}] of [
    []
])console.log(x);
for (let { x = 'a' in {} } of [
    {}
])console.log(x);
