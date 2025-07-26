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
}, <Component foo={12} bar="yes" baz="yeah"/>, <Component foo={12}/>, <Component bar="yes" baz="yeah"/>, <Component bar="yes" baz="yo" bat="ohno"/>, <Component foo={12} bar={null} baz="cool"/>, <Component foo={12} bar="yeah" baz={null}/>;
var JustPropTypes = /*#__PURE__*/ function(ReactComponent1) {
    function JustPropTypes() {
        return _class_call_check(this, JustPropTypes), _call_super(this, JustPropTypes, arguments);
    }
    return _inherits(JustPropTypes, ReactComponent1), JustPropTypes;
}(ReactComponent);
JustPropTypes.propTypes = {
    foo: PropTypes.number,
    bar: PropTypes.node.isRequired
}, <JustPropTypes foo={12} bar="ok"/>, <JustPropTypes foo="no"/>, <JustPropTypes foo={null} bar="ok"/>, <JustPropTypes foo={12} bar={null}/>;
var JustDefaultProps = /*#__PURE__*/ function(ReactComponent1) {
    function JustDefaultProps() {
        return _class_call_check(this, JustDefaultProps), _call_super(this, JustDefaultProps, arguments);
    }
    return _inherits(JustDefaultProps, ReactComponent1), JustDefaultProps;
}(ReactComponent);
JustDefaultProps.defaultProps = {
    foo: 42
}, <JustDefaultProps foo={12}/>, <JustDefaultProps foo={12} bar="ok"/>, <JustDefaultProps foo="no"/>;
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
}, <BothWithSpecifiedGeneric foo="fine" bar="yes" baz={12}/>, <BothWithSpecifiedGeneric foo="no"/>, <BothWithSpecifiedGeneric bar="yes" baz={12}/>, <BothWithSpecifiedGeneric bar="yes" baz={12} bat="ohno"/>, <BothWithSpecifiedGeneric foo="no" bar={null} baz={0}/>, <BothWithSpecifiedGeneric foo="eh" bar="yeah" baz={null}/>;
var JustPropTypesWithSpecifiedGeneric = /*#__PURE__*/ function(ReactComponent1) {
    function JustPropTypesWithSpecifiedGeneric() {
        return _class_call_check(this, JustPropTypesWithSpecifiedGeneric), _call_super(this, JustPropTypesWithSpecifiedGeneric, arguments);
    }
    return _inherits(JustPropTypesWithSpecifiedGeneric, ReactComponent1), JustPropTypesWithSpecifiedGeneric;
}(ReactComponent);
JustPropTypesWithSpecifiedGeneric.propTypes = {
    foo: PropTypes.string,
    bar: PropTypes.node.isRequired
}, <JustPropTypesWithSpecifiedGeneric foo="nice" bar="ok"/>, <JustPropTypesWithSpecifiedGeneric foo={12}/>, <JustPropTypesWithSpecifiedGeneric foo={null} bar="ok"/>, <JustPropTypesWithSpecifiedGeneric foo="cool" bar={null}/>;
var JustDefaultPropsWithSpecifiedGeneric = /*#__PURE__*/ function(ReactComponent1) {
    function JustDefaultPropsWithSpecifiedGeneric() {
        return _class_call_check(this, JustDefaultPropsWithSpecifiedGeneric), _call_super(this, JustDefaultPropsWithSpecifiedGeneric, arguments);
    }
    return _inherits(JustDefaultPropsWithSpecifiedGeneric, ReactComponent1), JustDefaultPropsWithSpecifiedGeneric;
}(ReactComponent);
JustDefaultPropsWithSpecifiedGeneric.defaultProps = {
    foo: "no"
}, <JustDefaultPropsWithSpecifiedGeneric foo="eh"/>, <JustDefaultPropsWithSpecifiedGeneric foo="no" bar="ok"/>, <JustDefaultPropsWithSpecifiedGeneric foo={12}/>, <JustDefaultPropsWithSpecifiedGeneric/>;
