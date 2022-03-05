import * as swcHelpers from "@swc/helpers";
var Component = function(ReactComponent) {
    "use strict";
    swcHelpers.inherits(Component, ReactComponent);
    var _super = swcHelpers.createSuper(Component);
    function Component() {
        return swcHelpers.classCallCheck(this, Component), _super.apply(this, arguments);
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
    swcHelpers.inherits(JustPropTypes, ReactComponent);
    var _super = swcHelpers.createSuper(JustPropTypes);
    function JustPropTypes() {
        return swcHelpers.classCallCheck(this, JustPropTypes), _super.apply(this, arguments);
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
    swcHelpers.inherits(JustDefaultProps, ReactComponent);
    var _super = swcHelpers.createSuper(JustDefaultProps);
    function JustDefaultProps() {
        return swcHelpers.classCallCheck(this, JustDefaultProps), _super.apply(this, arguments);
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
    swcHelpers.inherits(BothWithSpecifiedGeneric, ReactComponent);
    var _super = swcHelpers.createSuper(BothWithSpecifiedGeneric);
    function BothWithSpecifiedGeneric() {
        return swcHelpers.classCallCheck(this, BothWithSpecifiedGeneric), _super.apply(this, arguments);
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
    swcHelpers.inherits(JustPropTypesWithSpecifiedGeneric, ReactComponent);
    var _super = swcHelpers.createSuper(JustPropTypesWithSpecifiedGeneric);
    function JustPropTypesWithSpecifiedGeneric() {
        return swcHelpers.classCallCheck(this, JustPropTypesWithSpecifiedGeneric), _super.apply(this, arguments);
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
    swcHelpers.inherits(JustDefaultPropsWithSpecifiedGeneric, ReactComponent);
    var _super = swcHelpers.createSuper(JustDefaultPropsWithSpecifiedGeneric);
    function JustDefaultPropsWithSpecifiedGeneric() {
        return swcHelpers.classCallCheck(this, JustDefaultPropsWithSpecifiedGeneric), _super.apply(this, arguments);
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
