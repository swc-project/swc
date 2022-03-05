import * as swcHelpers from "@swc/helpers";
const React = require("react");
class Poisoned extends React.Component {
    render() {
        return React.createElement("div", null, "Hello");
    }
}
React.createElement(Poisoned, swcHelpers.extends({}, {
    x: "hello world",
    y: 2
}));
class EmptyProp extends React.Component {
    render() {
        return React.createElement("div", null, "Default hi");
    }
}
React.createElement(EmptyProp, swcHelpers.extends({}, {
    prop1: !1
}));
