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
var Component = /*#__PURE__*/ function(ReactComponent) {
    "use strict";
    _inherits(Component, ReactComponent);
    var _super = _createSuper(Component);
    function Component() {
        _classCallCheck(this, Component);
        return _super.apply(this, arguments);
    }
    return Component;
}(ReactComponent);
Component.propTypes = {
    foo: PropTypes.number,
    bar: PropTypes.node,
    baz: PropTypes.string.isRequired
};
Component.defaultProps = {
    foo: 42
};
var a = /*#__PURE__*/ React.createElement(Component, {
    foo: 12,
    bar: "yes",
    baz: "yeah"
});
var b = /*#__PURE__*/ React.createElement(Component, {
    foo: 12
}); // Error, missing required prop bar
var c = /*#__PURE__*/ React.createElement(Component, {
    bar: "yes",
    baz: "yeah"
});
var d = /*#__PURE__*/ React.createElement(Component, {
    bar: "yes",
    baz: "yo",
    bat: "ohno"
}); // Error, baz not a valid prop
var e = /*#__PURE__*/ React.createElement(Component, {
    foo: 12,
    bar: null,
    baz: "cool"
}); // bar is nullable/undefinable since it's not marked `isRequired`
var f = /*#__PURE__*/ React.createElement(Component, {
    foo: 12,
    bar: "yeah",
    baz: null
}); // Error, baz is _not_ nullable/undefinable since it's marked `isRequired`
var JustPropTypes = /*#__PURE__*/ function(ReactComponent) {
    "use strict";
    _inherits(JustPropTypes, ReactComponent);
    var _super = _createSuper(JustPropTypes);
    function JustPropTypes() {
        _classCallCheck(this, JustPropTypes);
        return _super.apply(this, arguments);
    }
    return JustPropTypes;
}(ReactComponent);
JustPropTypes.propTypes = {
    foo: PropTypes.number,
    bar: PropTypes.node.isRequired
};
var g = /*#__PURE__*/ React.createElement(JustPropTypes, {
    foo: 12,
    bar: "ok"
});
var h = /*#__PURE__*/ React.createElement(JustPropTypes, {
    foo: "no"
}); // error, wrong type
var i = /*#__PURE__*/ React.createElement(JustPropTypes, {
    foo: null,
    bar: "ok"
});
var j = /*#__PURE__*/ React.createElement(JustPropTypes, {
    foo: 12,
    bar: null
}); // error, bar is required
var JustDefaultProps = /*#__PURE__*/ function(ReactComponent) {
    "use strict";
    _inherits(JustDefaultProps, ReactComponent);
    var _super = _createSuper(JustDefaultProps);
    function JustDefaultProps() {
        _classCallCheck(this, JustDefaultProps);
        return _super.apply(this, arguments);
    }
    return JustDefaultProps;
}(ReactComponent);
JustDefaultProps.defaultProps = {
    foo: 42
};
var k = /*#__PURE__*/ React.createElement(JustDefaultProps, {
    foo: 12
});
var l = /*#__PURE__*/ React.createElement(JustDefaultProps, {
    foo: 12,
    bar: "ok"
}); // error, no prop named bar
var m = /*#__PURE__*/ React.createElement(JustDefaultProps, {
    foo: "no"
}); // error, wrong type
var BothWithSpecifiedGeneric = /*#__PURE__*/ function(ReactComponent) {
    "use strict";
    _inherits(BothWithSpecifiedGeneric, ReactComponent);
    var _super = _createSuper(BothWithSpecifiedGeneric);
    function BothWithSpecifiedGeneric() {
        _classCallCheck(this, BothWithSpecifiedGeneric);
        return _super.apply(this, arguments);
    }
    return BothWithSpecifiedGeneric;
}(ReactComponent);
BothWithSpecifiedGeneric.propTypes = {
    foo: PropTypes.string,
    bar: PropTypes.node,
    baz: PropTypes.number.isRequired
};
BothWithSpecifiedGeneric.defaultProps = {
    foo: "yo"
};
var n = /*#__PURE__*/ React.createElement(BothWithSpecifiedGeneric, {
    foo: "fine",
    bar: "yes",
    baz: 12
});
var o1 = /*#__PURE__*/ React.createElement(BothWithSpecifiedGeneric, {
    foo: "no"
}); // Error, missing required prop bar
var p1 = /*#__PURE__*/ React.createElement(BothWithSpecifiedGeneric, {
    bar: "yes",
    baz: 12
});
var q = /*#__PURE__*/ React.createElement(BothWithSpecifiedGeneric, {
    bar: "yes",
    baz: 12,
    bat: "ohno"
}); // Error, baz not a valid prop
var r = /*#__PURE__*/ React.createElement(BothWithSpecifiedGeneric, {
    foo: "no",
    bar: null,
    baz: 0
}); // bar is nullable/undefinable since it's not marked `isRequired`
var s = /*#__PURE__*/ React.createElement(BothWithSpecifiedGeneric, {
    foo: "eh",
    bar: "yeah",
    baz: null
}); // Error, baz is _not_ nullable/undefinable since it's marked `isRequired`
var JustPropTypesWithSpecifiedGeneric = /*#__PURE__*/ function(ReactComponent) {
    "use strict";
    _inherits(JustPropTypesWithSpecifiedGeneric, ReactComponent);
    var _super = _createSuper(JustPropTypesWithSpecifiedGeneric);
    function JustPropTypesWithSpecifiedGeneric() {
        _classCallCheck(this, JustPropTypesWithSpecifiedGeneric);
        return _super.apply(this, arguments);
    }
    return JustPropTypesWithSpecifiedGeneric;
}(ReactComponent);
JustPropTypesWithSpecifiedGeneric.propTypes = {
    foo: PropTypes.string,
    bar: PropTypes.node.isRequired
};
var t = /*#__PURE__*/ React.createElement(JustPropTypesWithSpecifiedGeneric, {
    foo: "nice",
    bar: "ok"
});
var u = /*#__PURE__*/ React.createElement(JustPropTypesWithSpecifiedGeneric, {
    foo: 12
}); // error, wrong type
var v = /*#__PURE__*/ React.createElement(JustPropTypesWithSpecifiedGeneric, {
    foo: null,
    bar: "ok"
}); // generic overrides propTypes required-ness, null isn't valid
var w = /*#__PURE__*/ React.createElement(JustPropTypesWithSpecifiedGeneric, {
    foo: "cool",
    bar: null
}); // error, bar is required
var JustDefaultPropsWithSpecifiedGeneric = /*#__PURE__*/ function(ReactComponent) {
    "use strict";
    _inherits(JustDefaultPropsWithSpecifiedGeneric, ReactComponent);
    var _super = _createSuper(JustDefaultPropsWithSpecifiedGeneric);
    function JustDefaultPropsWithSpecifiedGeneric() {
        _classCallCheck(this, JustDefaultPropsWithSpecifiedGeneric);
        return _super.apply(this, arguments);
    }
    return JustDefaultPropsWithSpecifiedGeneric;
}(ReactComponent);
JustDefaultPropsWithSpecifiedGeneric.defaultProps = {
    foo: "no"
};
var x = /*#__PURE__*/ React.createElement(JustDefaultPropsWithSpecifiedGeneric, {
    foo: "eh"
});
var y = /*#__PURE__*/ React.createElement(JustDefaultPropsWithSpecifiedGeneric, {
    foo: "no",
    bar: "ok"
}); // error, no prop named bar
var z = /*#__PURE__*/ React.createElement(JustDefaultPropsWithSpecifiedGeneric, {
    foo: 12
}); // error, wrong type
var aa = /*#__PURE__*/ React.createElement(JustDefaultPropsWithSpecifiedGeneric, null);
