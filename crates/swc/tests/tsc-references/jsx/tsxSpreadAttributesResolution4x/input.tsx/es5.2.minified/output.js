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
function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
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
var j, _this = this, React = require("react"), Poisoned = function(_Component) {
    "use strict";
    _inherits(Poisoned, _Component);
    var _super = _createSuper(Poisoned);
    function Poisoned() {
        return _classCallCheck(this, Poisoned), _super.apply(this, arguments);
    }
    return _createClass(Poisoned, [
        {
            key: "render",
            value: function() {
                return React.createElement("div", null, "Hello");
            }
        }
    ]), Poisoned;
}(React.Component);
React.createElement(Poisoned, _extends({
}, {
    x: "hello world",
    y: 2
}));
var EmptyProp = function(_Component) {
    "use strict";
    _inherits(EmptyProp, _Component);
    var _super = _createSuper(EmptyProp);
    function EmptyProp() {
        return _classCallCheck(this, EmptyProp), _super.apply(this, arguments);
    }
    return _createClass(EmptyProp, [
        {
            key: "render",
            value: function() {
                return React.createElement("div", null, "Default hi");
            }
        }
    ]), EmptyProp;
}(React.Component);
React.createElement(EmptyProp, _extends({
}, {
})), React.createElement(EmptyProp, _extends({
}, j)), React.createElement(EmptyProp, _extends({
}, {
    ref: function(input) {
        _this.textInput = input;
    }
})), React.createElement(EmptyProp, {
    "data-prop": !0
}), React.createElement(EmptyProp, _extends({
}, {
    "data-prop": !0
}));
export { };
