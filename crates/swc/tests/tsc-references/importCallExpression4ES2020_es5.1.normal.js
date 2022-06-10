import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import regeneratorRuntime from "regenerator-runtime";
// @lib: es2020
// @module: es2020
// @target: es2020
// @filename: 0.ts
export var B = /*#__PURE__*/ function() {
    "use strict";
    function B() {
        _class_call_check(this, B);
    }
    var _proto = B.prototype;
    _proto.print = function print() {
        return "I am B";
    };
    return B;
}();
export function foo() {
    return "foo";
}
// @filename: 1.ts
export function backup() {
    return "backup";
}
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
        this.myModule = import("./0");
    }
    var _proto = C.prototype;
    _proto.method = function method() {
        var loadAsync = import("./0");
        this.myModule.then(function(Zero) {
            console.log(Zero.foo());
        }, function() {
            var _ref = _async_to_generator(regeneratorRuntime.mark(function _callee(err) {
                var one;
                return regeneratorRuntime.wrap(function _callee$(_ctx) {
                    while(1)switch(_ctx.prev = _ctx.next){
                        case 0:
                            console.log(err);
                            _ctx.next = 3;
                            return import("./1");
                        case 3:
                            one = _ctx.sent;
                            console.log(one.backup());
                        case 5:
                        case "end":
                            return _ctx.stop();
                    }
                }, _callee);
            }));
            return function(err) {
                return _ref.apply(this, arguments);
            };
        }());
    };
    return C;
}();
