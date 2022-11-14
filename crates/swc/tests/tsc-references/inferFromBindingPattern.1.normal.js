//// [inferFromBindingPattern.ts]
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
var x1 = f1(); // string
var _f2 = _sliced_to_array(f2(), 1), x2 = _f2[0]; // string
var _f3 = f3(), x3 = _f3.x; // string
// Repro from #30379
function foo() {
    return [
        42
    ];
}
var _foo = _sliced_to_array(foo(), 1), x = _foo[0]; // [number]
var _selectJohn = _sliced_to_array(selectJohn(), 1), person = _selectJohn[0];
var _selectJohn1 = _sliced_to_array(selectJohn(), 2), any = _selectJohn1[0], whatever = _selectJohn1[1];
var john = selectJohn();
var _john = _sliced_to_array(john, 2), personAgain = _john[0], nufinspecial = _john[1];
var isStringTuple = makeTuple(stringy()); // [string]
var _makeTuple = _sliced_to_array(makeTuple(stringy()), 1), isAny = _makeTuple[0]; // [string]
