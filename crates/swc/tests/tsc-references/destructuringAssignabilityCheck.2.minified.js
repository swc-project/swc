//// [destructuringAssignabilityCheck.ts]
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _throw from "@swc/helpers/src/_throw.mjs";
var ref = _sliced_to_array({}, 0), undefined = undefined;
function foo(param) {
    var param = null !== param ? param : _throw(new TypeError("Cannot destructure undefined"));
    return 0;
}
function bar(param) {
    return _sliced_to_array(param, 0), 0;
}
_sliced_to_array({}, 0), function(param) {
    var param = null !== param ? param : _throw(new TypeError("Cannot destructure undefined"));
}(undefined);
var ref1 = 1, ref1 = null !== ref1 ? ref1 : _throw(new TypeError("Cannot destructure undefined")), ref2 = _sliced_to_array({}, 0);
