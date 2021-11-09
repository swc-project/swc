function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _objectWithoutProperties(source, excluded) {
    if (null == source) return {
    };
    var key, i, target = _objectWithoutPropertiesLoose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++)key = sourceSymbolKeys[i], excluded.indexOf(key) >= 0 || Object.prototype.propertyIsEnumerable.call(source, key) && (target[key] = source[key]);
    }
    return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
    if (null == source) return {
    };
    var key, i, target = {
    }, sourceKeys = Object.keys(source);
    for(i = 0; i < sourceKeys.length; i++)key = sourceKeys[i], excluded.indexOf(key) >= 0 || (target[key] = source[key]);
    return target;
}
suddenly(function(_param) {
    return _param.x, _objectWithoutProperties(_param, [
        "x"
    ]).y;
}), suddenly(function(param) {
    var _param = void 0 === param ? {
        x: {
            z: 1,
            ka: 1
        },
        y: "noo"
    } : param, _z = _param.x.z, nested = _objectWithoutProperties(_param.x, [
        "z"
    ]), rest = _objectWithoutProperties(_param, [
        "x"
    ]);
    return rest.y + nested.ka;
});
var C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C);
    }
    return Constructor = C, protoProps = [
        {
            key: "m",
            value: function(_param) {
                _param.a, _objectWithoutProperties(_param, [
                    "a"
                ]);
            }
        },
        {
            key: "p",
            set: function(_param) {
                _param.a, _objectWithoutProperties(_param, [
                    "a"
                ]);
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}();
function foobar(param) {
    var _param = void 0 === param ? {
    } : param;
    _param.bar, _objectWithoutProperties(_param, [
        "bar"
    ]);
}
foobar(), foobar({
    baz: "hello"
}), foobar({
    bar: {
        greeting: "hello"
    }
});
