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
};
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
};
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
};
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
};
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
};
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
};
