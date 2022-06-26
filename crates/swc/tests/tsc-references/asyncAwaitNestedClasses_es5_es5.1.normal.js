import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import regeneratorRuntime from "regenerator-runtime";
var _B;
// @target: ES5
// @lib: es5,es2015.promise
// @noEmitHelpers: true
// https://github.com/Microsoft/TypeScript/issues/20744
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
A.B = (_B = /*#__PURE__*/ function() {
    "use strict";
    function B() {
        _class_call_check(this, B);
    }
    B.func2 = function func2() {
        return new Promise(function(resolve) {
            resolve(null);
        });
    };
    return B;
}(), _B.C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    C.func = function func() {
        return _async_to_generator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _ctx.next = 2;
                        return _B.func2();
                    case 2:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    };
    return C;
}(), _B);
A.B.C.func();
