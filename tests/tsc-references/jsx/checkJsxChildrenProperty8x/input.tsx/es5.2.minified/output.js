function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _getPrototypeOf(o) {
    return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    }, _getPrototypeOf(o);
}
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
var React = require("react"), Button = function(_Component) {
    "use strict";
    var Constructor, protoProps, staticProps;
    function Button() {
        var self, call, obj;
        return !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, Button), self = this, call = _getPrototypeOf(Button).apply(this, arguments), call && ("object" == ((obj = call) && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj) || "function" == typeof call) ? call : (function(self) {
            if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return self;
        })(self);
    }
    return !function(subClass, superClass) {
        if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                writable: !0,
                configurable: !0
            }
        }), superClass && _setPrototypeOf(subClass, superClass);
    }(Button, _Component), Constructor = Button, protoProps = [
        {
            key: "render",
            value: function() {
                return React.createElement("div", null, "My Button");
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Button;
}(React.Component);
function AnotherButton(p) {
    return React.createElement("h1", null, "Just Another Button");
}
function Comp(p) {
    return React.createElement("div", null, p.b);
}
React.createElement(Comp, {
    a: 10,
    b: "hi"
}, React.createElement(Button, null), "  ", React.createElement(AnotherButton, null)), React.createElement(Comp, {
    a: 10,
    b: "hi"
}, React.createElement(Button, null), React.createElement(AnotherButton, null), "  "), React.createElement(Comp, {
    a: 10,
    b: "hi"
}, "    ", React.createElement(Button, null), React.createElement(AnotherButton, null)), React.createElement(Comp, {
    a: 10,
    b: "hi"
}, React.createElement(Button, null), "  ");
export { };
