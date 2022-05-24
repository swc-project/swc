import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(loadModule);
// @module: commonjs
// @target: es6
// @noImplicitAny: true
// @filename: defaultPath.ts
export var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
import("".concat(directory, "\\").concat(moduleFile));
import(getSpecifier());
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
    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _$directory, path;
    return regeneratorRuntime.wrap(function loadModule$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                _ctx.prev = 1;
                _iterator = directories[Symbol.iterator]();
            case 3:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                    _ctx.next = 13;
                    break;
                }
                _$directory = _step.value;
                path = "".concat(_$directory, "\\moduleFile");
                _ctx.next = 8;
                return path;
            case 8:
                _ctx.t0 = _ctx.sent;
                import(_ctx.t0);
            case 10:
                _iteratorNormalCompletion = true;
                _ctx.next = 3;
                break;
            case 13:
                _ctx.next = 19;
                break;
            case 15:
                _ctx.prev = 15;
                _ctx.t1 = _ctx["catch"](1);
                _didIteratorError = true;
                _iteratorError = _ctx.t1;
            case 19:
                _ctx.prev = 19;
                _ctx.prev = 20;
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            case 22:
                _ctx.prev = 22;
                if (!_didIteratorError) {
                    _ctx.next = 25;
                    break;
                }
                throw _iteratorError;
            case 25:
                return _ctx.finish(22);
            case 26:
                return _ctx.finish(19);
            case 27:
            case "end":
                return _ctx.stop();
        }
    }, _marked, null, [
        [
            1,
            15,
            19,
            27
        ],
        [
            20,
            ,
            22,
            26
        ]
    ]);
}
