//// [jsxReactTestSuite.tsx]
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
/*#__PURE__*/ React.createElement("div", null, "text");
/*#__PURE__*/ React.createElement("div", null, this.props.children);
/*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("br", null)), /*#__PURE__*/ React.createElement(Component, null, foo, /*#__PURE__*/ React.createElement("br", null), bar), /*#__PURE__*/ React.createElement("br", null));
/*#__PURE__*/ React.createElement(Composite, null, this.props.children);
/*#__PURE__*/ React.createElement(Composite, null, /*#__PURE__*/ React.createElement(Composite2, null));
var x = /*#__PURE__*/ React.createElement("div", {
    attr1: "foo" + "bar",
    attr2: "foo" + "bar" + "baz" + "bug",
    attr3: "foo" + "bar" + "baz" + "bug",
    attr4: "baz"
});
/*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("span", null), /*#__PURE__*/ React.createElement("br", null));
/*#__PURE__*/ React.createElement("div", {
    /* a multi-line
       comment */ attr1: "foo"
}, /*#__PURE__*/ React.createElement("span" // a double-slash comment
, {
    attr2: "bar"
}));
/*#__PURE__*/ React.createElement("div", null, "\xa0");
/*#__PURE__*/ React.createElement("div", null, "\xa0 ");
/*#__PURE__*/ React.createElement("hasOwnProperty", null, "testing");
/*#__PURE__*/ React.createElement(Component, {
    constructor: "foo"
});
/*#__PURE__*/ React.createElement(Namespace.Component, null);
/*#__PURE__*/ React.createElement(Namespace.DeepNamespace.Component, null);
/*#__PURE__*/ React.createElement(Component, _object_spread_props(_object_spread({}, x), {
    y: 2,
    z: true
}));
/*#__PURE__*/ React.createElement(Component, _object_spread_props(_object_spread({}, this.props), {
    sound: "moo"
}));
/*#__PURE__*/ React.createElement("font-face", null);
/*#__PURE__*/ React.createElement(Component, {
    x: y
});
/*#__PURE__*/ React.createElement("x-component", null);
/*#__PURE__*/ React.createElement(Component, x);
/*#__PURE__*/ React.createElement(Component, _object_spread_props(_object_spread({}, x), {
    y: 2
}));
/*#__PURE__*/ React.createElement(Component, _object_spread_props(_object_spread({}, x), {
    y: 2,
    z: true
}));
/*#__PURE__*/ React.createElement(Component, _object_spread({
    x: 1
}, y));
/*#__PURE__*/ React.createElement(Component, _object_spread({
    x: 1,
    y: "2"
}, z, z), /*#__PURE__*/ React.createElement(Child, null));
/*#__PURE__*/ React.createElement(Component, _object_spread_props(_object_spread({
    x: "1"
}, (z = {
    y: 2
}, z)), {
    z: 3
}), "Text");
