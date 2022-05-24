import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var Component = function(ReactComponent) {
    "use strict";
    _inherits(Component, ReactComponent);
    var _super = _create_super(Component);
    function Component() {
        return _class_call_check(this, Component), _super.apply(this, arguments);
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
    _inherits(JustPropTypes, ReactComponent);
    var _super = _create_super(JustPropTypes);
    function JustPropTypes() {
        return _class_call_check(this, JustPropTypes), _super.apply(this, arguments);
    }
    return JustPropTypes;
}(ReactComponent);
JustPropTypes.propTypes = {
    foo: PropTypes.number,
    bar: PropTypes.node.isRequired
};
var JustDefaultProps = function(ReactComponent) {
    "use strict";
    _inherits(JustDefaultProps, ReactComponent);
    var _super = _create_super(JustDefaultProps);
    function JustDefaultProps() {
        return _class_call_check(this, JustDefaultProps), _super.apply(this, arguments);
    }
    return JustDefaultProps;
}(ReactComponent);
JustDefaultProps.defaultProps = {
    foo: 42
};
var BothWithSpecifiedGeneric = function(ReactComponent) {
    "use strict";
    _inherits(BothWithSpecifiedGeneric, ReactComponent);
    var _super = _create_super(BothWithSpecifiedGeneric);
    function BothWithSpecifiedGeneric() {
        return _class_call_check(this, BothWithSpecifiedGeneric), _super.apply(this, arguments);
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
    _inherits(JustPropTypesWithSpecifiedGeneric, ReactComponent);
    var _super = _create_super(JustPropTypesWithSpecifiedGeneric);
    function JustPropTypesWithSpecifiedGeneric() {
        return _class_call_check(this, JustPropTypesWithSpecifiedGeneric), _super.apply(this, arguments);
    }
    return JustPropTypesWithSpecifiedGeneric;
}(ReactComponent);
JustPropTypesWithSpecifiedGeneric.propTypes = {
    foo: PropTypes.string,
    bar: PropTypes.node.isRequired
};
var JustDefaultPropsWithSpecifiedGeneric = function(ReactComponent) {
    "use strict";
    _inherits(JustDefaultPropsWithSpecifiedGeneric, ReactComponent);
    var _super = _create_super(JustDefaultPropsWithSpecifiedGeneric);
    function JustDefaultPropsWithSpecifiedGeneric() {
        return _class_call_check(this, JustDefaultPropsWithSpecifiedGeneric), _super.apply(this, arguments);
    }
    return JustDefaultPropsWithSpecifiedGeneric;
}(ReactComponent);
JustDefaultPropsWithSpecifiedGeneric.defaultProps = {
    foo: "no"
};
