//// [destructuringAssignabilityCheck.ts]
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _throw from "@swc/helpers/src/_throw.mjs";
_sliced_to_array({}, 0);
var undefined = undefined;
_sliced_to_array({}, 0), function(param) {
    var param = null !== param ? param : _throw(new TypeError("Cannot destructure undefined"));
}(undefined);
var _ref = 1, _ref = null !== _ref ? _ref : _throw(new TypeError("Cannot destructure undefined"));
_sliced_to_array({}, 0);
