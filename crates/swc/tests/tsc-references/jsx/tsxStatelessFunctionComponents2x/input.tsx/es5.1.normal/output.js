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
function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
        }));
        return true;
    } catch (e) {
        return false;
    }
}
function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn(this, result);
    };
}
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require('react');
function Greet(x) {
    return(/*#__PURE__*/ React.createElement("div", null, "Hello, ", x));
}
var BigGreeter = /*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(BigGreeter, _Component);
    var _super = _createSuper(BigGreeter);
    function BigGreeter() {
        _classCallCheck(this, BigGreeter);
        return _super.apply(this, arguments);
    }
    _createClass(BigGreeter, [
        {
            key: "render",
            value: function render() {
                return(/*#__PURE__*/ React.createElement("div", null));
            }
        }
    ]);
    return BigGreeter;
}(React.Component);
// OK
var a = /*#__PURE__*/ React.createElement(Greet, null);
// OK - always valid to specify 'key'
var b = /*#__PURE__*/ React.createElement(Greet, {
    key: "k"
});
// Error - not allowed to specify 'ref' on SFCs
var c = /*#__PURE__*/ React.createElement(Greet, {
    ref: "myRef"
});
// OK - ref is valid for classes
var d = /*#__PURE__*/ React.createElement(BigGreeter, {
    ref: function(x) {
        return x.greeting.substr(10);
    }
});
// Error ('subtr' not on string)
var e = /*#__PURE__*/ React.createElement(BigGreeter, {
    ref: function(x) {
        return x.greeting.subtr(10);
    }
});
// Error (ref callback is contextually typed)
var f = /*#__PURE__*/ React.createElement(BigGreeter, {
    ref: function(x) {
        return x.notARealProperty;
    }
});
// OK - key is always valid
var g = /*#__PURE__*/ React.createElement(BigGreeter, {
    key: 100
});
// OK - contextually typed intrinsic ref callback parameter
var h = /*#__PURE__*/ React.createElement("div", {
    ref: function(x) {
        return x.innerText;
    }
});
// Error - property not on ontextually typed intrinsic ref callback parameter
var i1 = /*#__PURE__*/ React.createElement("div", {
    ref: function(x) {
        return x.propertyNotOnHtmlDivElement;
    }
});
export { };
