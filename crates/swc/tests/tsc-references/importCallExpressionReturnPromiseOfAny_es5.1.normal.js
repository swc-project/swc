// @module: commonjs
// @target: es6
// @noImplicitAny: true
// @filename: defaultPath.ts
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
// @filename: 1.ts
import("".concat(directory, "\\").concat(moduleFile));
import(getSpecifier());
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
var p1 = import(ValidSomeCondition() ? "./0" : "externalModule");
var p1 = import(getSpecifier());
var p11 = import(getSpecifier());
var p2 = import(whatToLoad ? getSpecifier() : "defaulPath");
p1.then(function(zero) {
    return zero.foo(); // ok, zero is any
});
var j;
var p3 = import(j = getSpecifier());
function loadModule(directories) {
    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _$directory, path, err;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                _state.label = 1;
            case 1:
                _state.trys.push([
                    1,
                    6,
                    7,
                    8
                ]);
                _iterator = directories[Symbol.iterator]();
                _state.label = 2;
            case 2:
                if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                    3,
                    5
                ];
                _$directory = _step.value;
                path = "".concat(_$directory, "\\moduleFile");
                return [
                    4,
                    path
                ];
            case 3:
                import(_state.sent());
                _state.label = 4;
            case 4:
                _iteratorNormalCompletion = true;
                return [
                    3,
                    2
                ];
            case 5:
                return [
                    3,
                    8
                ];
            case 6:
                err = _state.sent();
                _didIteratorError = true;
                _iteratorError = err;
                return [
                    3,
                    8
                ];
            case 7:
                try {
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                        _iterator.return();
                    }
                } finally{
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
                return [
                    7
                ];
            case 8:
                return [
                    2
                ];
        }
    });
}
export { };
