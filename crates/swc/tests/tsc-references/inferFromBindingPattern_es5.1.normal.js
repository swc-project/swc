import * as swcHelpers from "@swc/helpers";
var x1 = f1(); // string
var ref = swcHelpers.slicedToArray(f2(), 1), x2 = ref[0]; // string
var ref1 = f3(), x3 = ref1.x; // string
// Repro from #30379
function foo() {
    return [
        42
    ];
}
var ref2 = swcHelpers.slicedToArray(foo(), 1), x = ref2[0]; // [number]
var ref3 = swcHelpers.slicedToArray(selectJohn(), 1), person = ref3[0];
var ref4 = swcHelpers.slicedToArray(selectJohn(), 2), any = ref4[0], whatever = ref4[1];
var john = selectJohn();
var _john = swcHelpers.slicedToArray(john, 2), personAgain = _john[0], nufinspecial = _john[1];
var isStringTuple = makeTuple(stringy()); // [string]
var ref5 = swcHelpers.slicedToArray(makeTuple(stringy()), 1), isAny = ref5[0]; // [string]
