//// [inferFromBindingPattern.ts]
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
f1(), _sliced_to_array(f2(), 1)[0], f3().x, _sliced_to_array([
    42
], 1)[0], _sliced_to_array(selectJohn(), 1)[0];
var _selectJohn = _sliced_to_array(selectJohn(), 2);
_selectJohn[0], _selectJohn[1];
var _john = _sliced_to_array(selectJohn(), 2);
_john[0], _john[1], makeTuple(stringy()), _sliced_to_array(makeTuple(stringy()), 1)[0];
