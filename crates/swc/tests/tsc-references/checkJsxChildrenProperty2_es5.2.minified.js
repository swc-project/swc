import * as swcHelpers from "@swc/helpers";
var React = require("react");
function Comp(p) {
    return React.createElement("div", null, p.b);
}
React.createElement(Comp, {
    a: 10,
    b: "hi"
}), React.createElement(Comp, {
    a: 10,
    b: "hi",
    children: "Random"
}, "hi hi hi!"), React.createElement(Comp, swcHelpers.extends({
    a: 10,
    b: "hi"
}, {
    children: "Random"
}), "hi hi hi!"), React.createElement(Comp, {
    a: 10,
    b: "hi"
}, React.createElement("div", null, " My Div "), function(name) {
    return React.createElement("div", null, " My name ", name, " ");
}), React.createElement(Comp, {
    a: 10,
    b: "hi"
}, React.createElement("div", null, " My Div "), 1000000), React.createElement(Comp, {
    a: 10,
    b: "hi"
}, React.createElement("div", null, " My Div "), "hi hi hi!"), React.createElement(Comp, {
    a: 10,
    b: "hi"
}, React.createElement("div", null, " My Div "), React.createElement("div", null, " My Div "));
