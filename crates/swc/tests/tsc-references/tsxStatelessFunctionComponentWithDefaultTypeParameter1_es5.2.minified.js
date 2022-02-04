var React = require("react");
function MyComponent(attr) {
    return React.createElement("div", null, "attr.values");
}
React.createElement(MyComponent, {
    values: !0
}), React.createElement(MyComponent, {
    values: "Hello"
});
export { };
