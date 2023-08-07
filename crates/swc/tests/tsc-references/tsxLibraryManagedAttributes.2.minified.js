//// [tsxLibraryManagedAttributes.tsx]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var Component = function(ReactComponent1) {
    _inherits(Component, ReactComponent1);
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
}, function(ReactComponent1) {
    _inherits(JustPropTypes, ReactComponent1);
    var _super = _create_super(JustPropTypes);
    function JustPropTypes() {
        return _class_call_check(this, JustPropTypes), _super.apply(this, arguments);
    }
    return JustPropTypes;
}(ReactComponent).propTypes = {
    foo: PropTypes.number,
    bar: PropTypes.node.isRequired
}, function(ReactComponent1) {
    _inherits(JustDefaultProps, ReactComponent1);
    var _super = _create_super(JustDefaultProps);
    function JustDefaultProps() {
        return _class_call_check(this, JustDefaultProps), _super.apply(this, arguments);
    }
    return JustDefaultProps;
}(ReactComponent).defaultProps = {
    foo: 42
};
var BothWithSpecifiedGeneric = function(ReactComponent1) {
    _inherits(BothWithSpecifiedGeneric, ReactComponent1);
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
}, function(ReactComponent1) {
    _inherits(JustPropTypesWithSpecifiedGeneric, ReactComponent1);
    var _super = _create_super(JustPropTypesWithSpecifiedGeneric);
    function JustPropTypesWithSpecifiedGeneric() {
        return _class_call_check(this, JustPropTypesWithSpecifiedGeneric), _super.apply(this, arguments);
    }
    return JustPropTypesWithSpecifiedGeneric;
}(ReactComponent).propTypes = {
    foo: PropTypes.string,
    bar: PropTypes.node.isRequired
}, function(ReactComponent1) {
    _inherits(JustDefaultPropsWithSpecifiedGeneric, ReactComponent1);
    var _super = _create_super(JustDefaultPropsWithSpecifiedGeneric);
    function JustDefaultPropsWithSpecifiedGeneric() {
        return _class_call_check(this, JustDefaultPropsWithSpecifiedGeneric), _super.apply(this, arguments);
    }
    return JustDefaultPropsWithSpecifiedGeneric;
}(ReactComponent).defaultProps = {
    foo: "no"
};
