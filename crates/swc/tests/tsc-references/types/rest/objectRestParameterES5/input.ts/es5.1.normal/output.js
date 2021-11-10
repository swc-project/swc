function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _objectWithoutProperties(source, excluded) {
    if (source == null) return {
    };
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++){
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {
    };
    var target = {
    };
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}
// @target: es5
function cloneAgain(_param) {
    var a = _param.a, clone = _objectWithoutProperties(_param, [
        "a"
    ]);
}
suddenly(function(_param) {
    var a = _param.x, rest = _objectWithoutProperties(_param, [
        "x"
    ]);
    return rest.y;
});
suddenly(function(param) {
    var _param = param === void 0 ? {
        x: {
            z: 1,
            ka: 1
        },
        y: 'noo'
    } : param;
    var _x = _param.x, _z = _x.z, z = _z === void 0 ? 12 : _z, nested = _objectWithoutProperties(_param.x, [
        "z"
    ]), rest = _objectWithoutProperties(_param, [
        "x"
    ]);
    return rest.y + nested.ka;
});
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    _createClass(C, [
        {
            key: "m",
            value: function m(_param) {
                var a = _param.a, clone = _objectWithoutProperties(_param, [
                    "a"
                ]);
            // actually, never mind, don't clone
            }
        },
        {
            key: "p",
            set: function set(_param) {
                var a = _param.a, clone = _objectWithoutProperties(_param, [
                    "a"
                ]);
            // actually, never mind, don't clone
            }
        }
    ]);
    return C;
}();
function foobar(param) {
    var _param = param === void 0 ? {
    } : param;
    var _bar = _param.bar, bar = _bar === void 0 ? {
    } : _bar, opts = _objectWithoutProperties(_param, [
        "bar"
    ]);
}
foobar();
foobar({
    baz: 'hello'
});
foobar({
    bar: {
        greeting: 'hello'
    }
});
