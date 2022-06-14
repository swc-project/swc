import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _await_async_generator from "@swc/helpers/src/_await_async_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_method_get from "@swc/helpers/src/_class_private_method_get.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(baz);
var _bar, _baz, _qux, _class;
// @target: es2019
var C = (_bar = /*#__PURE__*/ new WeakSet(), _baz = /*#__PURE__*/ new WeakSet(), _qux = /*#__PURE__*/ new WeakSet(), _class = /*#__PURE__*/ function() {
    "use strict";
    function _class1() {
        _class_call_check(this, _class1);
        _class_private_method_init(this, _bar);
        _class_private_method_init(this, _baz);
        _class_private_method_init(this, _qux);
    }
    var _proto = _class1.prototype;
    _proto.foo = function foo() {
        var _this = this;
        return _async_to_generator(regeneratorRuntime.mark(function _callee() {
            var b;
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _ctx.next = 2;
                        return _class_private_method_get(_this, _bar, bar).call(_this);
                    case 2:
                        b = _ctx.sent;
                        _ctx.t0 = b + (_class_private_method_get(_this, _baz, baz).call(_this).next().value || 0);
                        _ctx.next = 6;
                        return _class_private_method_get(_this, _qux, qux).call(_this).next();
                    case 6:
                        _ctx.t1 = _ctx.sent.value;
                        if (_ctx.t1) {
                            _ctx.next = 9;
                            break;
                        }
                        _ctx.t1 = 0;
                    case 9:
                        _ctx.t2 = _ctx.t1;
                        return _ctx.abrupt("return", _ctx.t0 + _ctx.t2);
                    case 11:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    };
    return _class1;
}(), _class);
new C().foo().then(console.log);
function bar() {
    return _bar1.apply(this, arguments);
}
function _bar1() {
    _bar1 = _async_to_generator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return Promise.resolve(42);
                case 2:
                    return _ctx.abrupt("return", _ctx.sent);
                case 3:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _bar1.apply(this, arguments);
}
function baz() {
    return regeneratorRuntime.wrap(function baz$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.next = 2;
                return 42;
            case 2:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
function qux() {
    return _qux1.apply(this, arguments);
}
function _qux1() {
    _qux1 = _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return _await_async_generator(Promise.resolve(42));
                case 2:
                    _ctx.next = 4;
                    return _ctx.sent;
                case 4:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _qux1.apply(this, arguments);
}
