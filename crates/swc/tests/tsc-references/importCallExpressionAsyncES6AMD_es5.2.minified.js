import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
export function fn() {
    return _fn.apply(this, arguments);
}
function _fn() {
    return (_fn = _async_to_generator(function() {
        var req;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        import("./test")
                    ];
                case 1:
                    return req = _state.sent(), [
                        2
                    ];
            }
        });
    })).apply(this, arguments);
}
export var cl1 = function() {
    "use strict";
    function cl1() {}
    return cl1.prototype.m = function() {
        return _async_to_generator(function() {
            var req;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            import("./test")
                        ];
                    case 1:
                        return req = _state.sent(), [
                            2
                        ];
                }
            });
        })();
    }, cl1;
}();
export var obj = {
    m: _async_to_generator(function() {
        var req;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        import("./test")
                    ];
                case 1:
                    return req = _state.sent(), [
                        2
                    ];
            }
        });
    })
};
export var cl2 = function() {
    "use strict";
    this.p = {
        m: _async_to_generator(function() {
            var req;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            import("./test")
                        ];
                    case 1:
                        return req = _state.sent(), [
                            2
                        ];
                }
            });
        })
    };
};
export var l = function() {
    var _ref = _async_to_generator(function() {
        var req;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        import("./test")
                    ];
                case 1:
                    return req = _state.sent(), [
                        2
                    ];
            }
        });
    });
    return function() {
        return _ref.apply(this, arguments);
    };
}();
