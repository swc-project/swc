import * as swcHelpers from "@swc/helpers";
var React = require("react");
export default function Component(props) {
    return React.createElement(AnotherComponent, swcHelpers.extends({}, props, {
        property2: !0,
        AnotherProperty1: "hi"
    }));
};
function AnotherComponent(param) {
    var property1 = param.property1;
    return React.createElement("span", null, property1);
}
