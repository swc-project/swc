//// [0.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
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
//// [1.ts]
export function backup() {
    return "backup";
}
//// [2.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
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
        }, /*#__PURE__*/ function() {
            var _ref = _async_to_generator(function(err) {
                var one;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            console.log(err);
                            return [
                                4,
                                import("./1")
                            ];
                        case 1:
                            one = _state.sent();
                            console.log(one.backup());
                            return [
                                2
                            ];
                    }
                });
            });
            return function(err) {
                return _ref.apply(this, arguments);
            };
        }());
    };
    return C;
}();
