function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
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
function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
}
function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assertThisInitialized(self);
}
function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _setPrototypeOf(o, p);
}
var _typeof = function(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
// @filename: file.tsx
// @jsx: react
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require('react');
var MyComponent = /*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(MyComponent, _Component);
    function MyComponent() {
        _classCallCheck(this, MyComponent);
        return _possibleConstructorReturn(this, _getPrototypeOf(MyComponent).apply(this, arguments));
    }
    _createClass(MyComponent, [
        {
            key: "render",
            value: function render() {
                var AnyComponent = this.props.AnyComponent;
                return(/*#__PURE__*/ React.createElement(AnyComponent, null));
            }
        }
    ]);
    return MyComponent;
}(React.Component);
// Stateless Component As Props
/*#__PURE__*/ React.createElement(MyComponent, {
    AnyComponent: function() {
        /*#__PURE__*/ return React.createElement("button", null, "test");
    }
});
var MyButtonComponent = // Component Class as Props
/*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(MyButtonComponent, _Component);
    function MyButtonComponent() {
        _classCallCheck(this, MyButtonComponent);
        return _possibleConstructorReturn(this, _getPrototypeOf(MyButtonComponent).apply(this, arguments));
    }
    return MyButtonComponent;
}(React.Component);
/*#__PURE__*/ React.createElement(MyComponent, {
    AnyComponent: MyButtonComponent
});
export { };
