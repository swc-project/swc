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
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
            })), !0;
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
var React = require("react"), RC1 = function(_Component) {
    "use strict";
    _inherits(RC1, _Component);
    var _super = _createSuper(RC1);
    function RC1() {
        return _classCallCheck(this, RC1), _super.apply(this, arguments);
    }
    return _createClass(RC1, [
        {
            key: "render",
            value: function() {
                return null;
            }
        }
    ]), RC1;
}(React.Component), RC2 = function(_Component) {
    "use strict";
    _inherits(RC2, _Component);
    var _super = _createSuper(RC2);
    function RC2() {
        return _classCallCheck(this, RC2), _super.apply(this, arguments);
    }
    return _createClass(RC2, [
        {
            key: "render",
            value: function() {
                return null;
            }
        },
        {
            key: "method",
            value: function() {
            }
        }
    ]), RC2;
}(React.Component), RC3 = function(_Component) {
    "use strict";
    _inherits(RC3, _Component);
    var _super = _createSuper(RC3);
    function RC3() {
        return _classCallCheck(this, RC3), _super.apply(this, arguments);
    }
    return _createClass(RC3, [
        {
            key: "render",
            value: function() {
                return null;
            }
        }
    ]), RC3;
}(React.Component), RC4 = function(_Component) {
    "use strict";
    _inherits(RC4, _Component);
    var _super = _createSuper(RC4);
    function RC4() {
        return _classCallCheck(this, RC4), _super.apply(this, arguments);
    }
    return _createClass(RC4, [
        {
            key: "render",
            value: function() {
                return null;
            }
        }
    ]), RC4;
}(React.Component), EmptyRCComp = RC3 || RC4, PartRCComp = RC1 || RC4;
React.createElement(RC1 || RC2, {
    x: "Hi"
}), React.createElement(EmptyRCComp, null), React.createElement(EmptyRCComp, {
    "data-prop": "hello"
}), React.createElement(PartRCComp, null), React.createElement(PartRCComp, {
    "data-extra": "hello"
});
export { };
