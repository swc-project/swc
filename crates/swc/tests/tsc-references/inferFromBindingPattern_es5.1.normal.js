import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
var x1 = f1(); // string
var ref = _sliced_to_array(f2(), 1), x2 = ref[0]; // string
var ref1 = f3(), x3 = ref1.x; // string
// Repro from #30379
function foo() {
    return [
        42
    ];
}
var ref2 = _sliced_to_array(foo(), 1), x = ref2[0]; // [number]
var ref3 = _sliced_to_array(selectJohn(), 1), person = ref3[0];
var ref4 = _sliced_to_array(selectJohn(), 2), any = ref4[0], whatever = ref4[1];
var john = selectJohn();
var _john = _sliced_to_array(john, 2), personAgain = _john[0], nufinspecial = _john[1];
var isStringTuple = makeTuple(stringy()); // [string]
var ref5 = _sliced_to_array(makeTuple(stringy()), 1), isAny = ref5[0]; // [string]
