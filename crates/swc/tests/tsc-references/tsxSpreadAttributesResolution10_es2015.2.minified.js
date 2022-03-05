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
React.createElement(Opt, swcHelpers.extends({}, {}, {
    x: 3
})), React.createElement(Opt, swcHelpers.extends({}, obj1, {
    x: "Hi"
})), React.createElement(Opt, swcHelpers.extends({}, obj1, {
    x: 3
})), React.createElement(Opt, {
    x: !0
});
