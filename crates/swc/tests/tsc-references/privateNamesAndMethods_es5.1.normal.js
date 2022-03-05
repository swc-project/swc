import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
var _foo = new WeakSet(), _bar = new WeakSet(), _baz = new WeakSet(), __quux = new WeakMap(), _quux = new WeakMap();
var A = function A() {
    "use strict";
    swcHelpers.classCallCheck(this, A);
    var _this_quux;
    swcHelpers.classPrivateMethodInit(this, _foo);
    swcHelpers.classPrivateMethodInit(this, _bar);
    swcHelpers.classPrivateMethodInit(this, _baz);
    swcHelpers.classPrivateFieldInit(this, _quux, {
        get: get_quux,
        set: set_quux
    });
    swcHelpers.classPrivateFieldInit(this, __quux, {
        writable: true,
        value: void 0
    });
    swcHelpers.classPrivateMethodGet(this, _foo, foo).call(this, 30);
    swcHelpers.classPrivateMethodGet(this, _bar, bar).call(this, 30);
    swcHelpers.classPrivateMethodGet(this, _baz, baz).call(this, 30);
    swcHelpers.classPrivateFieldSet(this, _quux, swcHelpers.classPrivateFieldGet(this, _quux) + 1);
    swcHelpers.classPrivateFieldSet(this, _quux, (_this_quux = +swcHelpers.classPrivateFieldGet(this, _quux)) + 1), _this_quux;
};
function foo(a) {}
function bar(a) {
    return _bar1.apply(this, arguments);
}
function _bar1() {
    _bar1 = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee(a) {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _bar1.apply(this, arguments);
}
function baz(a) {
    return _baz1.apply(this, arguments);
}
function _baz1() {
    _baz1 = swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee(a) {
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
    return _baz1.apply(this, arguments);
}
function get_quux() {
    return swcHelpers.classPrivateFieldGet(this, __quux);
}
function set_quux(val) {
    swcHelpers.classPrivateFieldSet(this, __quux, val);
}
var _foo1 = new WeakSet();
var B = /*#__PURE__*/ function(A) {
    "use strict";
    swcHelpers.inherits(B, A);
    var _super = swcHelpers.createSuper(B);
    function B() {
        swcHelpers.classCallCheck(this, B);
        var _this;
        _this = _super.call(this);
        swcHelpers.classPrivateMethodInit(swcHelpers.assertThisInitialized(_this), _foo1);
        swcHelpers.classPrivateMethodGet(_this, _foo1, foo1).call(swcHelpers.assertThisInitialized(_this), "str");
        return _this;
    }
    return B;
}(A);
function foo1(a) {}
