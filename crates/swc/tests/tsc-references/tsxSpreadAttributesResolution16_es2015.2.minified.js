import _extends from "@swc/helpers/src/_extends.mjs";
let React = require('react');
export default function Component(props) {
    return React.createElement(AnotherComponent, _extends({}, props));
};
function AnotherComponent({ property1  }) {
    return React.createElement("span", null, property1);
}
