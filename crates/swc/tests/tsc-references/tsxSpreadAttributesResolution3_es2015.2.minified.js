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
})), React.createElement(Poisoned, {
    x: "hi",
    y: 2
});
