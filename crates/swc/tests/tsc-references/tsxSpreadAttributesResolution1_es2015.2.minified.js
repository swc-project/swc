import * as swcHelpers from "@swc/helpers";
const React = require("react");
class Poisoned extends React.Component {
    render() {
        return React.createElement("div", null, "Hello");
    }
}
React.createElement(Poisoned, swcHelpers.extends({}, {})), React.createElement(Poisoned, null);
