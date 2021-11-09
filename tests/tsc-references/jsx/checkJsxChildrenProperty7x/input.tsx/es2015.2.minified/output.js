const React = require("react");
class Button extends React.Component {
    render() {
        return React.createElement("div", null, "My Button");
    }
}
function AnotherButton(p) {
    return React.createElement("h1", null, "Just Another Button");
}
function Comp(p) {
    return React.createElement("div", null, p.b);
}
React.createElement(Comp, {
    a: 10,
    b: "hi"
}, React.createElement(Button, null), "  ", React.createElement(AnotherButton, null)), React.createElement(Comp, {
    a: 10,
    b: "hi"
}, React.createElement(Button, null), React.createElement(AnotherButton, null), "  "), React.createElement(Comp, {
    a: 10,
    b: "hi"
}, "    ", React.createElement(Button, null), React.createElement(AnotherButton, null));
export { };
