function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _defineProperty(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {
        }, ownKeys = Object.keys(source);
        "function" == typeof Object.getOwnPropertySymbols && (ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
            return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }))), ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
var K = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function K() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, K), this.p = 12;
    }
    return protoProps = [
        {
            key: "m",
            value: function() {
            }
        },
        {
            key: "g",
            get: function() {
                return 0;
            }
        }
    ], _defineProperties((Constructor = K).prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), K;
}(), k = new K(), sk = _objectSpread({
}, k), ssk = _objectSpread({
}, k, k);
sk.p, sk.m(), sk.g, ssk.p, ssk.m(), ssk.g;
var i1 = {
    p: 12,
    m: function() {
    },
    get g () {
        return 0;
    }
}, si = _objectSpread({
}, i1), ssi = _objectSpread({
}, i1, i1);
si.p, si.m(), si.g, ssi.p, ssi.m(), ssi.g;
var o = {
    p: 12,
    m: function() {
    },
    get g () {
        return 0;
    }
}, so = _objectSpread({
}, o), sso = _objectSpread({
}, o, o);
so.p, so.m(), so.g, sso.p, sso.m(), sso.g;
