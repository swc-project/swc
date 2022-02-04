var React = require("react");
function Comp(p) {
    return React.createElement("div", null, p.b);
}
React.createElement(Comp, {
    a: 10,
    b: "hi",
    children: "lol"
}), React.createElement(Comp, {
    a: 10,
    b: "hi"
}, "hi hi hi!"), React.createElement(Comp, {
    a: 10,
    b: "hi"
}, React.createElement("div", null, "hi hi hi!"));
export { };
