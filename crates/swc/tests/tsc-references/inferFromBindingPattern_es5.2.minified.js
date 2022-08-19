import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
f1();
var ref = _sliced_to_array(f2(), 1);
ref[0], f3().x;
var ref1 = _sliced_to_array([
    42
], 1);
ref1[0];
var ref2 = _sliced_to_array(selectJohn(), 1);
ref2[0];
var ref3 = _sliced_to_array(selectJohn(), 2);
ref3[0], ref3[1];
var _john = _sliced_to_array(selectJohn(), 2);
_john[0], _john[1], makeTuple(stringy());
var ref4 = _sliced_to_array(makeTuple(stringy()), 1);
ref4[0];
