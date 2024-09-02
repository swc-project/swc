//// [tsxLibraryManagedAttributes.tsx]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Component = /*#__PURE__*/ function(ReactComponent1) {
    function Component() {
        return _class_call_check(this, Component), _call_super(this, Component, arguments);
    }
    return _inherits(Component, ReactComponent1), Component;
}(ReactComponent);
Component.propTypes = {
    foo: PropTypes.number,
    bar: PropTypes.node,
    baz: PropTypes.string.isRequired
}, Component.defaultProps = {
    foo: 42
}, /*#__PURE__*/ function(ReactComponent1) {
    function JustPropTypes() {
        return _class_call_check(this, JustPropTypes), _call_super(this, JustPropTypes, arguments);
    }
    return _inherits(JustPropTypes, ReactComponent1), JustPropTypes;
}(ReactComponent).propTypes = {
    foo: PropTypes.number,
    bar: PropTypes.node.isRequired
}, /*#__PURE__*/ function(ReactComponent1) {
    function JustDefaultProps() {
        return _class_call_check(this, JustDefaultProps), _call_super(this, JustDefaultProps, arguments);
    }
    return _inherits(JustDefaultProps, ReactComponent1), JustDefaultProps;
}(ReactComponent).defaultProps = {
    foo: 42
};
var BothWithSpecifiedGeneric = /*#__PURE__*/ function(ReactComponent1) {
    function BothWithSpecifiedGeneric() {
        return _class_call_check(this, BothWithSpecifiedGeneric), _call_super(this, BothWithSpecifiedGeneric, arguments);
    }
    return _inherits(BothWithSpecifiedGeneric, ReactComponent1), BothWithSpecifiedGeneric;
}(ReactComponent);
BothWithSpecifiedGeneric.propTypes = {
    foo: PropTypes.string,
    bar: PropTypes.node,
    baz: PropTypes.number.isRequired
}, BothWithSpecifiedGeneric.defaultProps = {
    foo: "yo"
}, /*#__PURE__*/ function(ReactComponent1) {
    function JustPropTypesWithSpecifiedGeneric() {
        return _class_call_check(this, JustPropTypesWithSpecifiedGeneric), _call_super(this, JustPropTypesWithSpecifiedGeneric, arguments);
    }
    return _inherits(JustPropTypesWithSpecifiedGeneric, ReactComponent1), JustPropTypesWithSpecifiedGeneric;
}(ReactComponent).propTypes = {
    foo: PropTypes.string,
    bar: PropTypes.node.isRequired
}, /*#__PURE__*/ function(ReactComponent1) {
    function JustDefaultPropsWithSpecifiedGeneric() {
        return _class_call_check(this, JustDefaultPropsWithSpecifiedGeneric), _call_super(this, JustDefaultPropsWithSpecifiedGeneric, arguments);
    }
    return _inherits(JustDefaultPropsWithSpecifiedGeneric, ReactComponent1), JustDefaultPropsWithSpecifiedGeneric;
}(ReactComponent).defaultProps = {
    foo: "no"
};
