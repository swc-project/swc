import * as swcHelpers from "@swc/helpers";
let React = require('react');
export default function Component(props) {
    return React.createElement(ChildComponent, swcHelpers.extends({}, props, {
        property1: "NewString"
    }));
};
function ChildComponent({ property1  }) {
    return React.createElement("span", null, property1);
}
