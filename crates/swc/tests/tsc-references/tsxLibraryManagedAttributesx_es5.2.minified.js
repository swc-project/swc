function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
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
var Component = function(ReactComponent) {
    "use strict";
    _inherits(Component, ReactComponent);
    var _super = _createSuper(Component);
    function Component() {
        return _classCallCheck(this, Component), _super.apply(this, arguments);
    }
    return Component;
}(ReactComponent);
Component.propTypes = {
    foo: PropTypes.number,
    bar: PropTypes.node,
    baz: PropTypes.string.isRequired
}, Component.defaultProps = {
    foo: 42
}, React.createElement(Component, {
    foo: 12,
    bar: "yes",
    baz: "yeah"
}), React.createElement(Component, {
    foo: 12
}), React.createElement(Component, {
    bar: "yes",
    baz: "yeah"
}), React.createElement(Component, {
    bar: "yes",
    baz: "yo",
    bat: "ohno"
}), React.createElement(Component, {
    foo: 12,
    bar: null,
    baz: "cool"
}), React.createElement(Component, {
    foo: 12,
    bar: "yeah",
    baz: null
});
var JustPropTypes = function(ReactComponent) {
    "use strict";
    _inherits(JustPropTypes, ReactComponent);
    var _super = _createSuper(JustPropTypes);
    function JustPropTypes() {
        return _classCallCheck(this, JustPropTypes), _super.apply(this, arguments);
    }
    return JustPropTypes;
}(ReactComponent);
JustPropTypes.propTypes = {
    foo: PropTypes.number,
    bar: PropTypes.node.isRequired
}, React.createElement(JustPropTypes, {
    foo: 12,
    bar: "ok"
}), React.createElement(JustPropTypes, {
    foo: "no"
}), React.createElement(JustPropTypes, {
    foo: null,
    bar: "ok"
}), React.createElement(JustPropTypes, {
    foo: 12,
    bar: null
});
var JustDefaultProps = function(ReactComponent) {
    "use strict";
    _inherits(JustDefaultProps, ReactComponent);
    var _super = _createSuper(JustDefaultProps);
    function JustDefaultProps() {
        return _classCallCheck(this, JustDefaultProps), _super.apply(this, arguments);
    }
    return JustDefaultProps;
}(ReactComponent);
JustDefaultProps.defaultProps = {
    foo: 42
}, React.createElement(JustDefaultProps, {
    foo: 12
}), React.createElement(JustDefaultProps, {
    foo: 12,
    bar: "ok"
}), React.createElement(JustDefaultProps, {
    foo: "no"
});
var BothWithSpecifiedGeneric = function(ReactComponent) {
    "use strict";
    _inherits(BothWithSpecifiedGeneric, ReactComponent);
    var _super = _createSuper(BothWithSpecifiedGeneric);
    function BothWithSpecifiedGeneric() {
        return _classCallCheck(this, BothWithSpecifiedGeneric), _super.apply(this, arguments);
    }
    return BothWithSpecifiedGeneric;
}(ReactComponent);
BothWithSpecifiedGeneric.propTypes = {
    foo: PropTypes.string,
    bar: PropTypes.node,
    baz: PropTypes.number.isRequired
}, BothWithSpecifiedGeneric.defaultProps = {
    foo: "yo"
}, React.createElement(BothWithSpecifiedGeneric, {
    foo: "fine",
    bar: "yes",
    baz: 12
}), React.createElement(BothWithSpecifiedGeneric, {
    foo: "no"
}), React.createElement(BothWithSpecifiedGeneric, {
    bar: "yes",
    baz: 12
}), React.createElement(BothWithSpecifiedGeneric, {
    bar: "yes",
    baz: 12,
    bat: "ohno"
}), React.createElement(BothWithSpecifiedGeneric, {
    foo: "no",
    bar: null,
    baz: 0
}), React.createElement(BothWithSpecifiedGeneric, {
    foo: "eh",
    bar: "yeah",
    baz: null
});
var JustPropTypesWithSpecifiedGeneric = function(ReactComponent) {
    "use strict";
    _inherits(JustPropTypesWithSpecifiedGeneric, ReactComponent);
    var _super = _createSuper(JustPropTypesWithSpecifiedGeneric);
    function JustPropTypesWithSpecifiedGeneric() {
        return _classCallCheck(this, JustPropTypesWithSpecifiedGeneric), _super.apply(this, arguments);
    }
    return JustPropTypesWithSpecifiedGeneric;
}(ReactComponent);
JustPropTypesWithSpecifiedGeneric.propTypes = {
    foo: PropTypes.string,
    bar: PropTypes.node.isRequired
}, React.createElement(JustPropTypesWithSpecifiedGeneric, {
    foo: "nice",
    bar: "ok"
}), React.createElement(JustPropTypesWithSpecifiedGeneric, {
    foo: 12
}), React.createElement(JustPropTypesWithSpecifiedGeneric, {
    foo: null,
    bar: "ok"
}), React.createElement(JustPropTypesWithSpecifiedGeneric, {
    foo: "cool",
    bar: null
});
var JustDefaultPropsWithSpecifiedGeneric = function(ReactComponent) {
    "use strict";
    _inherits(JustDefaultPropsWithSpecifiedGeneric, ReactComponent);
    var _super = _createSuper(JustDefaultPropsWithSpecifiedGeneric);
    function JustDefaultPropsWithSpecifiedGeneric() {
        return _classCallCheck(this, JustDefaultPropsWithSpecifiedGeneric), _super.apply(this, arguments);
    }
    return JustDefaultPropsWithSpecifiedGeneric;
}(ReactComponent);
JustDefaultPropsWithSpecifiedGeneric.defaultProps = {
    foo: "no"
}, React.createElement(JustDefaultPropsWithSpecifiedGeneric, {
    foo: "eh"
}), React.createElement(JustDefaultPropsWithSpecifiedGeneric, {
    foo: "no",
    bar: "ok"
}), React.createElement(JustDefaultPropsWithSpecifiedGeneric, {
    foo: 12
}), React.createElement(JustDefaultPropsWithSpecifiedGeneric, null);
