// @target: es2019
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _await_async_generator from "@swc/helpers/src/_await_async_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_method_get from "@swc/helpers/src/_class_private_method_get.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
var _bar, _baz, _qux, _class;
var C = (_bar = /*#__PURE__*/ new WeakSet(), _baz = /*#__PURE__*/ new WeakSet(), _qux = /*#__PURE__*/ new WeakSet(), _class = /*#__PURE__*/ function() {
    "use strict";
    function _class() {
        _class_call_check(this, _class);
        _class_private_method_init(this, _bar);
        _class_private_method_init(this, _baz);
        _class_private_method_init(this, _qux);
    }
    var _proto = _class.prototype;
    _proto.foo = function foo() {
        var _this = this;
        return _async_to_generator(function() {
            var b;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            _class_private_method_get(_this, _bar, bar).call(_this)
                        ];
                    case 1:
                        b = _state.sent();
                        _ = b + (_class_private_method_get(_this, _baz, baz).call(_this).next().value || 0);
                        return [
                            4,
                            _class_private_method_get(_this, _qux, qux).call(_this).next()
                        ];
                    case 2:
                        return [
                            2,
                            _ + (_state.sent().value || 0)
                        ];
                }
            });
        })();
    };
    return _class;
}(), _class);
new C().foo().then(console.log);
function bar() {
    return _bar1.apply(this, arguments);
}
function _bar1() {
    _bar1 = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Promise.resolve(42)
                    ];
                case 1:
                    return [
                        2,
                        _state.sent()
                    ];
            }
        });
    });
    return _bar1.apply(this, arguments);
}
function baz() {
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4,
                    42
                ];
            case 1:
                _state.sent();
                return [
                    2
                ];
        }
    });
}
function qux() {
    return _qux1.apply(this, arguments);
}
function _qux1() {
    _qux1 = _wrap_async_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        _await_async_generator(Promise.resolve(42))
                    ];
                case 1:
                    return [
                        4,
                        _state.sent()
                    ];
                case 2:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    });
    return _qux1.apply(this, arguments);
}
