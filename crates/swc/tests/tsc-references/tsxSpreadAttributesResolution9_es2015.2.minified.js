import * as swcHelpers from "@swc/helpers";
const React = require("react");
class Opt extends React.Component {
    render() {
        return React.createElement("div", null, "Hello");
    }
}
const obj1 = {
    x: 2
};
React.createElement(Opt, null), React.createElement(Opt, swcHelpers.extends({}, {})), React.createElement(Opt, swcHelpers.extends({}, obj1)), React.createElement(Opt, swcHelpers.extends({}, obj1, {
    y: !0
})), React.createElement(Opt, {
    x: 2
});
