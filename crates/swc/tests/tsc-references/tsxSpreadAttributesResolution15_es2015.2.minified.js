import * as swcHelpers from "@swc/helpers";
let React = require('react');
export default function Component(props) {
    return React.createElement(AnotherComponent, swcHelpers.extends({}, props, {
        property2: !0,
        AnotherProperty1: "hi"
    }));
};
function AnotherComponent({ property1  }) {
    return React.createElement("span", null, property1);
}
