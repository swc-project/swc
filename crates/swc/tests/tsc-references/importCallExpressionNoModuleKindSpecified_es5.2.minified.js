import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import regeneratorRuntime from "regenerator-runtime";
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
export function backup() {
    return "backup";
}
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C), this.myModule = import("./0");
    }
    return C.prototype.method = function() {
        var _ref;
        import("./0"), this.myModule.then(function(Zero) {
            console.log(Zero.foo());
        }, (_ref = _async_to_generator(regeneratorRuntime.mark(function _callee(err) {
            var one;
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                        return console.log(err), _ctx.next = 3, import("./1");
                    case 3:
                        one = _ctx.sent, console.log(one.backup());
                    case 5:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        })), function(err) {
            return _ref.apply(this, arguments);
        }));
    }, C;
}();
