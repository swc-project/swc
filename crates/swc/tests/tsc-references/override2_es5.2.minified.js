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
var AB = function() {
    "use strict";
    _classCallCheck(this, AB);
}, AD1 = function(AB1) {
    "use strict";
    _inherits(AD1, AB1);
    var _super = _createSuper(AD1);
    function AD1() {
        return _classCallCheck(this, AD1), _super.apply(this, arguments);
    }
    return AD1;
}(AB), AD2 = function(AB2) {
    "use strict";
    _inherits(AD2, AB2);
    var _super = _createSuper(AD2);
    function AD2() {
        return _classCallCheck(this, AD2), _super.apply(this, arguments);
    }
    return AD2;
}(AB), AD3 = function(AB3) {
    "use strict";
    _inherits(AD3, AB3);
    var _super = _createSuper(AD3);
    function AD3() {
        return _classCallCheck(this, AD3), _super.apply(this, arguments);
    }
    return _createClass(AD3, [
        {
            key: "foo",
            value: function(v) {}
        },
        {
            key: "baz",
            value: function() {}
        }
    ]), AD3;
}(AB), D4 = function(AB4) {
    "use strict";
    _inherits(D4, AB4);
    var _super = _createSuper(D4);
    function D4() {
        return _classCallCheck(this, D4), _super.apply(this, arguments);
    }
    return _createClass(D4, [
        {
            key: "foo",
            value: function(v) {}
        },
        {
            key: "bar",
            value: function(v) {}
        },
        {
            key: "baz",
            value: function() {}
        }
    ]), D4;
}(AB);
