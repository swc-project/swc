import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(baz);
var _bar, _baz, _qux, _class;
// @target: es2019
var C = (_bar = /*#__PURE__*/ new WeakSet(), _baz = /*#__PURE__*/ new WeakSet(), _qux = /*#__PURE__*/ new WeakSet(), _class = /*#__PURE__*/ function() {
    "use strict";
    function _class1() {
        swcHelpers.classCallCheck(this, _class1);
        swcHelpers.classPrivateMethodInit(this, _bar);
        swcHelpers.classPrivateMethodInit(this, _baz);
        swcHelpers.classPrivateMethodInit(this, _qux);
    }
    var _proto = _class1.prototype;
    _proto.foo = function foo() {
        var _this = this;
        return swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            var b;
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _ctx.next = 2;
                        return swcHelpers.classPrivateMethodGet(_this, _bar, bar).call(_this);
                    case 2:
                        b = _ctx.sent;
                        _ctx.t0 = b + (swcHelpers.classPrivateMethodGet(_this, _baz, baz).call(_this).next().value || 0);
                        _ctx.next = 6;
                        return swcHelpers.classPrivateMethodGet(_this, _qux, qux).call(_this).next();
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
    _bar1 = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
    _qux1 = swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return swcHelpers.awaitAsyncGenerator(Promise.resolve(42));
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
