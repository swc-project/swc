var _bar, _baz, _qux;
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _await_async_generator from "@swc/helpers/src/_await_async_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_method_get from "@swc/helpers/src/_class_private_method_get.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function bar() {
    return _bar1.apply(this, arguments);
}
function _bar1() {
    return (_bar1 = _async_to_generator(function() {
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
    })).apply(this, arguments);
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
                return _state.sent(), [
                    2
                ];
        }
    });
}
function qux() {
    return _qux1.apply(this, arguments);
}
function _qux1() {
    return (_qux1 = _wrap_async_generator(function() {
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
                    return _state.sent(), [
                        2
                    ];
            }
        });
    })).apply(this, arguments);
}
new (_bar = new WeakSet(), _baz = new WeakSet(), _qux = new WeakSet(), function() {
    "use strict";
    function _class() {
        _class_call_check(this, _class), _class_private_method_init(this, _bar), _class_private_method_init(this, _baz), _class_private_method_init(this, _qux);
    }
    var _proto = _class.prototype;
    return _proto.foo = function() {
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
                        return _ = (b = _state.sent()) + (_class_private_method_get(_this, _baz, baz).call(_this).next().value || 0), [
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
    }, _class;
}())().foo().then(console.log);
