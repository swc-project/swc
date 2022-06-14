import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(function(directories) {
    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _$directory, path;
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0, _ctx.prev = 1, _iterator = directories[Symbol.iterator]();
            case 3:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                    _ctx.next = 13;
                    break;
                }
                return _$directory = _step.value, path = "".concat(_$directory, "\\moduleFile"), _ctx.next = 8, path;
            case 8:
                _ctx.t0 = _ctx.sent, import(_ctx.t0);
            case 10:
                _iteratorNormalCompletion = !0, _ctx.next = 3;
                break;
            case 13:
                _ctx.next = 19;
                break;
            case 15:
                _ctx.prev = 15, _ctx.t1 = _ctx.catch(1), _didIteratorError = !0, _iteratorError = _ctx.t1;
            case 19:
                _ctx.prev = 19, _ctx.prev = 20, _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
            case 22:
                if (_ctx.prev = 22, !_didIteratorError) {
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
});
export var C = function() {
    "use strict";
    _class_call_check(this, C);
};
import("".concat(directory, "\\").concat(moduleFile)), import(getSpecifier());
var p1 = (import(ValidSomeCondition() ? "./0" : "externalModule"), import(getSpecifier()));
import(getSpecifier()), import(whatToLoad ? getSpecifier() : "defaulPath"), p1.then(function(zero) {
    return zero.foo();
}), import(getSpecifier());
