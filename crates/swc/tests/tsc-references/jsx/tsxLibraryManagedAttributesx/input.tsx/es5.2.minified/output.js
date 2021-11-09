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
function _possibleConstructorReturn(self, call) {
    return call && ("object" === _typeof(call) || "function" == typeof call) ? call : (function(self) {
        if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return self;
    })(self);
}
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
var _typeof = function(obj) {
    return obj && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
}, Component = function(ReactComponent) {
    "use strict";
    function Component() {
        return _classCallCheck(this, Component), _possibleConstructorReturn(this, _getPrototypeOf(Component).apply(this, arguments));
    }
    return _inherits(Component, ReactComponent), Component;
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
    function JustPropTypes() {
        return _classCallCheck(this, JustPropTypes), _possibleConstructorReturn(this, _getPrototypeOf(JustPropTypes).apply(this, arguments));
    }
    return _inherits(JustPropTypes, ReactComponent), JustPropTypes;
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
    function JustDefaultProps() {
        return _classCallCheck(this, JustDefaultProps), _possibleConstructorReturn(this, _getPrototypeOf(JustDefaultProps).apply(this, arguments));
    }
    return _inherits(JustDefaultProps, ReactComponent), JustDefaultProps;
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
    function BothWithSpecifiedGeneric() {
        return _classCallCheck(this, BothWithSpecifiedGeneric), _possibleConstructorReturn(this, _getPrototypeOf(BothWithSpecifiedGeneric).apply(this, arguments));
    }
    return _inherits(BothWithSpecifiedGeneric, ReactComponent), BothWithSpecifiedGeneric;
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
    function JustPropTypesWithSpecifiedGeneric() {
        return _classCallCheck(this, JustPropTypesWithSpecifiedGeneric), _possibleConstructorReturn(this, _getPrototypeOf(JustPropTypesWithSpecifiedGeneric).apply(this, arguments));
    }
    return _inherits(JustPropTypesWithSpecifiedGeneric, ReactComponent), JustPropTypesWithSpecifiedGeneric;
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
    function JustDefaultPropsWithSpecifiedGeneric() {
        return _classCallCheck(this, JustDefaultPropsWithSpecifiedGeneric), _possibleConstructorReturn(this, _getPrototypeOf(JustDefaultPropsWithSpecifiedGeneric).apply(this, arguments));
    }
    return _inherits(JustDefaultPropsWithSpecifiedGeneric, ReactComponent), JustDefaultPropsWithSpecifiedGeneric;
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
