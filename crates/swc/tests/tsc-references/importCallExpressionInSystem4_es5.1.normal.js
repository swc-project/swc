import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
// @module: system
// @target: esnext
// @useDefineForClassFields: false
// @filename: 0.ts
export var B = /*#__PURE__*/ function() {
    "use strict";
    function B() {
        swcHelpers.classCallCheck(this, B);
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
        swcHelpers.classCallCheck(this, C);
        this.myModule = import("./0");
    }
    var _proto = C.prototype;
    _proto.method = function method() {
        var loadAsync = import("./0");
        this.myModule.then(function(Zero) {
            console.log(Zero.foo());
        }, function() {
            var _ref = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee(err) {
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
export var D = /*#__PURE__*/ function() {
    "use strict";
    function D() {
        swcHelpers.classCallCheck(this, D);
        this.myModule = import("./0");
    }
    var _proto = D.prototype;
    _proto.method = function method() {
        var loadAsync = import("./0");
        this.myModule.then(function(Zero) {
            console.log(Zero.foo());
        }, function() {
            var _ref = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee(err) {
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
    return D;
}();
