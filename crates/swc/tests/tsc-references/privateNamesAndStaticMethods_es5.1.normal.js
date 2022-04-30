import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
// @strict: true
// @target: esnext, es2022
// @lib: esnext, es2022
// @useDefineForClassFields: false
var A = function A() {
    "use strict";
    swcHelpers.classCallCheck(this, A);
    swcHelpers.classStaticPrivateMethodGet(A, A, foo).call(A, 30);
    swcHelpers.classStaticPrivateMethodGet(A, A, bar).call(A, 30);
    swcHelpers.classStaticPrivateMethodGet(A, A, bar).call(A, 30);
    swcHelpers.classStaticPrivateFieldSpecSet(A, A, _quux, swcHelpers.classStaticPrivateFieldSpecGet(A, A, _quux) + 1);
    swcHelpers.classStaticPrivateFieldUpdate(A, _quux).value++;
};
var _quux = {
    get: get_quux,
    set: set_quux
};
var __quux = {
    writable: true,
    value: void 0
};
function foo(a) {}
function bar(a) {
    return _bar.apply(this, arguments);
}
function _bar() {
    _bar = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee(a) {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _bar.apply(this, arguments);
}
function baz(a) {
    return _baz.apply(this, arguments);
}
function _baz() {
    _baz = swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee(a) {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.abrupt("return", 3);
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _baz.apply(this, arguments);
}
function get_quux() {
    return swcHelpers.classStaticPrivateFieldSpecGet(this, A, __quux);
}
function set_quux(val) {
    swcHelpers.classStaticPrivateFieldSpecSet(this, A, __quux, val);
}
var B = /*#__PURE__*/ function(A) {
    "use strict";
    swcHelpers.inherits(B, A);
    var _super = swcHelpers.createSuper(B);
    function B() {
        swcHelpers.classCallCheck(this, B);
        var _this = _super.call(this);
        swcHelpers.classStaticPrivateMethodGet(B, B, foo1).call(B, "str");
        return _this;
    }
    return B;
}(A);
function foo1(a) {}
