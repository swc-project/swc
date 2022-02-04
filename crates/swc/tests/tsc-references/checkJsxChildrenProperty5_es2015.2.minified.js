const React = require("react");
class Button extends React.Component {
    render() {
        return React.createElement("div", null, "My Button");
    }
}
function Comp(p) {
    return React.createElement("div", null, p.b);
}
React.createElement(Comp, {
    a: 10,
    b: "hi"
}), React.createElement(Comp, {
    a: 10,
    b: "hi"
}, React.createElement(Button, null)), React.createElement(Comp, {
    a: 10,
    b: "hi"
}, Button);
export { };
