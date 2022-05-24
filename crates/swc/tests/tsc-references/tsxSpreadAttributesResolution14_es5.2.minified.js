import _extends from "@swc/helpers/lib/_extends.js";
var React = require("react");
export default function Component(props) {
    return React.createElement(AnotherComponent, _extends({}, props, {
        Property1: !0
    }));
};
function AnotherComponent(param) {
    var property1 = param.property1;
    return React.createElement("span", null, property1);
}
