// @strict: true
let x1 = f1(); // string
let [x2] = f2(); // string
let { x: x3  } = f3(); // string
// Repro from #30379
function foo() {
    return [
        42
    ];
}
const [x] = foo(); // [number]
const [person] = selectJohn();
const [any, whatever] = selectJohn();
const john = selectJohn();
const [personAgain, nufinspecial] = john;
const isStringTuple = makeTuple(stringy()); // [string]
const [isAny] = makeTuple(stringy()); // [string]
