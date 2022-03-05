import * as swcHelpers from "@swc/helpers";
var Component = /*#__PURE__*/ function(ReactComponent) {
    "use strict";
    swcHelpers.inherits(Component, ReactComponent);
    var _super = swcHelpers.createSuper(Component);
    function Component() {
        swcHelpers.classCallCheck(this, Component);
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
    swcHelpers.inherits(JustPropTypes, ReactComponent);
    var _super = swcHelpers.createSuper(JustPropTypes);
    function JustPropTypes() {
        swcHelpers.classCallCheck(this, JustPropTypes);
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
    swcHelpers.inherits(JustDefaultProps, ReactComponent);
    var _super = swcHelpers.createSuper(JustDefaultProps);
    function JustDefaultProps() {
        swcHelpers.classCallCheck(this, JustDefaultProps);
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
    swcHelpers.inherits(BothWithSpecifiedGeneric, ReactComponent);
    var _super = swcHelpers.createSuper(BothWithSpecifiedGeneric);
    function BothWithSpecifiedGeneric() {
        swcHelpers.classCallCheck(this, BothWithSpecifiedGeneric);
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
var o = /*#__PURE__*/ React.createElement(BothWithSpecifiedGeneric, {
    foo: "no"
}); // Error, missing required prop bar
var p = /*#__PURE__*/ React.createElement(BothWithSpecifiedGeneric, {
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
    swcHelpers.inherits(JustPropTypesWithSpecifiedGeneric, ReactComponent);
    var _super = swcHelpers.createSuper(JustPropTypesWithSpecifiedGeneric);
    function JustPropTypesWithSpecifiedGeneric() {
        swcHelpers.classCallCheck(this, JustPropTypesWithSpecifiedGeneric);
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
    swcHelpers.inherits(JustDefaultPropsWithSpecifiedGeneric, ReactComponent);
    var _super = swcHelpers.createSuper(JustDefaultPropsWithSpecifiedGeneric);
    function JustDefaultPropsWithSpecifiedGeneric() {
        swcHelpers.classCallCheck(this, JustDefaultPropsWithSpecifiedGeneric);
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
