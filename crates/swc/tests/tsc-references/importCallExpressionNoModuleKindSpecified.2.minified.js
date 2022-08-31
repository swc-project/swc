//// [0.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var B = function() {
    "use strict";
    function B() {
        _class_call_check(this, B);
    }
    return B.prototype.print = function() {
        return "I am B";
    }, B;
}();
export function foo() {
    return "foo";
}
//// [1.ts]
export function backup() {
    return "backup";
}
//// [2.ts]
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
!function() {
    "use strict";
    function C() {
        this.myModule = import("./0");
    }
    return C.prototype.method = function() {
        var _ref;
        import("./0"), this.myModule.then(function(Zero) {
            console.log(Zero.foo());
        }, (_ref = _async_to_generator(function(err) {
            var one;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return console.log(err), [
                            4,
                            import("./1")
                        ];
                    case 1:
                        return one = _state.sent(), console.log(one.backup()), [
                            2
                        ];
                }
            });
        }), function(err) {
            return _ref.apply(this, arguments);
        }));
    }, C;
}();
