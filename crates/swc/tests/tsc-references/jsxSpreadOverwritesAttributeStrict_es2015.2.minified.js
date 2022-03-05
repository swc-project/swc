import * as swcHelpers from "@swc/helpers";
const React = require("react"), props = {
    a: 1,
    b: 1
}, Foo = (props1)=>React.createElement("div", null, props1.a)
;
React.createElement(Foo, swcHelpers.extends({}, props)), React.createElement(Foo, swcHelpers.extends({
    d: 1
}, props)), React.createElement(Foo, swcHelpers.extends({
    a: 1
}, props)), React.createElement(Foo, swcHelpers.extends({
    a: 1,
    b: 2
}, props)), React.createElement(Foo, swcHelpers.extends({
    a: 1,
    d: 1
}, props, {
    d: 1
})), React.createElement(Foo, swcHelpers.extends({
    a: 1,
    d: 1
}, props, {
    a: 1,
    d: 1
}));
