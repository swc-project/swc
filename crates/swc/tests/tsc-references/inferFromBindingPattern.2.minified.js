//// [inferFromBindingPattern.ts]
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
var x1 = f1(), ref = _sliced_to_array(f2(), 1), x2 = ref[0], ref1 = f3(), x3 = ref1.x;
function foo() {
    return [
        42
    ];
}
var ref2 = _sliced_to_array(foo(), 1), x = ref2[0], ref3 = _sliced_to_array(selectJohn(), 1), person = ref3[0], ref4 = _sliced_to_array(selectJohn(), 2), any = ref4[0], whatever = ref4[1], john = selectJohn(), _john = _sliced_to_array(john, 2), personAgain = _john[0], nufinspecial = _john[1], isStringTuple = makeTuple(stringy()), ref5 = _sliced_to_array(makeTuple(stringy()), 1), isAny = ref5[0];
