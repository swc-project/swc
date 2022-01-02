function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i1 = 0; i1 < props.length; i1++){
        var descriptor = props[i1];
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
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _objectSpread(target) {
    for(var i1 = 1; i1 < arguments.length; i1++){
        var source = arguments[i1] != null ? arguments[i1] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
var K = // @target: esnext
/*#__PURE__*/ function() {
    "use strict";
    function K() {
        _classCallCheck(this, K);
        this.p = 12;
    }
    _createClass(K, [
        {
            key: "m",
            value: function m() {}
        },
        {
            key: "g",
            get: function get() {
                return 0;
            }
        }
    ]);
    return K;
}();
var k = new K();
var sk = _objectSpread({}, k);
var ssk = _objectSpread({}, k, k);
sk.p;
sk.m(); // error
sk.g; // error
ssk.p;
ssk.m(); // error
ssk.g; // error
var i = {
    p: 12,
    m: function m() {},
    get g () {
        return 0;
    }
};
var si = _objectSpread({}, i);
var ssi = _objectSpread({}, i, i);
si.p;
si.m(); // ok
si.g; // ok
ssi.p;
ssi.m(); // ok
ssi.g; // ok
var o = {
    p: 12,
    m: function m() {},
    get g () {
        return 0;
    }
};
var so = _objectSpread({}, o);
var sso = _objectSpread({}, o, o);
so.p;
so.m(); // ok
so.g; // ok
sso.p;
sso.m(); // ok
sso.g; // ok
