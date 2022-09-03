//// [generatorAssignability.ts]
let [x1] = g1, [x2] = g2, [...y1] = g1, [...y2] = g2;
for (_ of ([_] = g1, [_] = g2, [..._] = g1, [..._] = g2, g1));
for (_ of g2);
async function asyncfn() {
    for await (_ of g1);
    for await (_ of g2);
    for await (_ of g4);
    for await (_ of g5);
}
function* f1() {
    yield* g1, yield* g3;
}
async function* f2() {
    yield* g1, yield* g3, yield* g4, yield* g6;
}
async function f3() {
    let syncGenerator = function*() {
        yield 1, yield 2;
    }, o = {
        [Symbol.asyncIterator]: syncGenerator
    };
    for await (let x of o);
}
