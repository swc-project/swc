//// [tsxLibraryManagedAttributes.tsx]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Component = /*#__PURE__*/ function(ReactComponent1) {
    "use strict";
    _inherits(Component, ReactComponent1);
    function Component() {
        _class_call_check(this, Component);
        return _call_super(this, Component, arguments);
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
var a = <Component foo={12} bar="yes" baz="yeah"/>;
var b = <Component foo={12}/>; // Error, missing required prop bar
var c = <Component bar="yes" baz="yeah"/>;
var d = <Component bar="yes" baz="yo" bat="ohno"/>; // Error, baz not a valid prop
var e = <Component foo={12} bar={null} baz="cool"/>; // bar is nullable/undefinable since it's not marked `isRequired`
var f = <Component foo={12} bar="yeah" baz={null}/>; // Error, baz is _not_ nullable/undefinable since it's marked `isRequired`
var JustPropTypes = /*#__PURE__*/ function(ReactComponent1) {
    "use strict";
    _inherits(JustPropTypes, ReactComponent1);
    function JustPropTypes() {
        _class_call_check(this, JustPropTypes);
        return _call_super(this, JustPropTypes, arguments);
    }
    return JustPropTypes;
}(ReactComponent);
JustPropTypes.propTypes = {
    foo: PropTypes.number,
    bar: PropTypes.node.isRequired
};
var g = <JustPropTypes foo={12} bar="ok"/>;
var h = <JustPropTypes foo="no"/>; // error, wrong type
var i = <JustPropTypes foo={null} bar="ok"/>;
var j = <JustPropTypes foo={12} bar={null}/>; // error, bar is required
var JustDefaultProps = /*#__PURE__*/ function(ReactComponent1) {
    "use strict";
    _inherits(JustDefaultProps, ReactComponent1);
    function JustDefaultProps() {
        _class_call_check(this, JustDefaultProps);
        return _call_super(this, JustDefaultProps, arguments);
    }
    return JustDefaultProps;
}(ReactComponent);
JustDefaultProps.defaultProps = {
    foo: 42
};
var k = <JustDefaultProps foo={12}/>;
var l = <JustDefaultProps foo={12} bar="ok"/>; // error, no prop named bar
var m = <JustDefaultProps foo="no"/>; // error, wrong type
var BothWithSpecifiedGeneric = /*#__PURE__*/ function(ReactComponent1) {
    "use strict";
    _inherits(BothWithSpecifiedGeneric, ReactComponent1);
    function BothWithSpecifiedGeneric() {
        _class_call_check(this, BothWithSpecifiedGeneric);
        return _call_super(this, BothWithSpecifiedGeneric, arguments);
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
var n = <BothWithSpecifiedGeneric foo="fine" bar="yes" baz={12}/>;
var o = <BothWithSpecifiedGeneric foo="no"/>; // Error, missing required prop bar
var p = <BothWithSpecifiedGeneric bar="yes" baz={12}/>;
var q = <BothWithSpecifiedGeneric bar="yes" baz={12} bat="ohno"/>; // Error, baz not a valid prop
var r = <BothWithSpecifiedGeneric foo="no" bar={null} baz={0}/>; // bar is nullable/undefinable since it's not marked `isRequired`
var s = <BothWithSpecifiedGeneric foo="eh" bar="yeah" baz={null}/>; // Error, baz is _not_ nullable/undefinable since it's marked `isRequired`
var JustPropTypesWithSpecifiedGeneric = /*#__PURE__*/ function(ReactComponent1) {
    "use strict";
    _inherits(JustPropTypesWithSpecifiedGeneric, ReactComponent1);
    function JustPropTypesWithSpecifiedGeneric() {
        _class_call_check(this, JustPropTypesWithSpecifiedGeneric);
        return _call_super(this, JustPropTypesWithSpecifiedGeneric, arguments);
    }
    return JustPropTypesWithSpecifiedGeneric;
}(ReactComponent);
JustPropTypesWithSpecifiedGeneric.propTypes = {
    foo: PropTypes.string,
    bar: PropTypes.node.isRequired
};
var t = <JustPropTypesWithSpecifiedGeneric foo="nice" bar="ok"/>;
var u = <JustPropTypesWithSpecifiedGeneric foo={12}/>; // error, wrong type
var v = <JustPropTypesWithSpecifiedGeneric foo={null} bar="ok"/>; // generic overrides propTypes required-ness, null isn't valid
var w = <JustPropTypesWithSpecifiedGeneric foo="cool" bar={null}/>; // error, bar is required
var JustDefaultPropsWithSpecifiedGeneric = /*#__PURE__*/ function(ReactComponent1) {
    "use strict";
    _inherits(JustDefaultPropsWithSpecifiedGeneric, ReactComponent1);
    function JustDefaultPropsWithSpecifiedGeneric() {
        _class_call_check(this, JustDefaultPropsWithSpecifiedGeneric);
        return _call_super(this, JustDefaultPropsWithSpecifiedGeneric, arguments);
    }
    return JustDefaultPropsWithSpecifiedGeneric;
}(ReactComponent);
JustDefaultPropsWithSpecifiedGeneric.defaultProps = {
    foo: "no"
};
var x = <JustDefaultPropsWithSpecifiedGeneric foo="eh"/>;
var y = <JustDefaultPropsWithSpecifiedGeneric foo="no" bar="ok"/>; // error, no prop named bar
var z = <JustDefaultPropsWithSpecifiedGeneric foo={12}/>; // error, wrong type
var aa = <JustDefaultPropsWithSpecifiedGeneric/>;
