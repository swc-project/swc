function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
}
function _getPrototypeOf(o) {
    return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    }, _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
    if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: !0,
            configurable: !0
        }
    }), superClass && _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
function _createSuper(Derived) {
    var hasNativeReflectConstruct = function() {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;
        try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
        } catch (e) {
            return !1;
        }
    }();
    return function() {
        var obj, self, call, result, Super = _getPrototypeOf(Derived);
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else result = Super.apply(this, arguments);
        return self = this, (call = result) && ("object" == ((obj = call) && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj) || "function" == typeof call) ? call : (function(self) {
            if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return self;
        })(self);
    };
}
var unionNumberString, unionDE, num, str, c, d, e, anyVar, C = function() {
    "use strict";
    _classCallCheck(this, C);
}, D = function(C1) {
    "use strict";
    _inherits(D, C1);
    var _super = _createSuper(D);
    function D() {
        return _classCallCheck(this, D), _super.apply(this, arguments);
    }
    return _createClass(D, [
        {
            key: "foo1",
            value: function() {}
        }
    ]), D;
}(C), E = function(C2) {
    "use strict";
    _inherits(E, C2);
    var _super = _createSuper(E);
    function E() {
        return _classCallCheck(this, E), _super.apply(this, arguments);
    }
    return _createClass(E, [
        {
            key: "foo2",
            value: function() {}
        }
    ]), E;
}(C);
c = d, c = e, c = unionDE, d = e, e = d = unionDE, e = unionDE, num = str, num = unionNumberString, str = num, str = unionNumberString, d = c, e = c, unionDE = c, e = d, unionDE = d, d = e, unionDE = e, str = num, unionNumberString = num, num = str, unionNumberString = str, anyVar = unionDE, anyVar = unionNumberString, unionDE = anyVar, unionNumberString = anyVar, unionDE = null, unionNumberString = null, unionDE = void 0, unionNumberString = void 0;
