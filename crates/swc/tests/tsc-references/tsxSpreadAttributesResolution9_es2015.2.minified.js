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
swcHelpers.extends({}, {}), swcHelpers.extends({}, obj1), swcHelpers.extends({}, obj1, {
    y: !0
});
