import * as swcHelpers from "@swc/helpers";
let React = require('react');
export default function Component(props) {
    return React.createElement(AnotherComponent, swcHelpers.extends({}, props, {
        Property1: !0
    }));
};
function AnotherComponent({ property1  }) {
    return React.createElement("span", null, property1);
}
