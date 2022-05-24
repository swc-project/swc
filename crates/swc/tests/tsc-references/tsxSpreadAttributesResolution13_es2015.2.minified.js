import _extends from "@swc/helpers/lib/_extends.js";
let React = require('react');
export default function Component(props) {
    return React.createElement(ChildComponent, _extends({}, props, {
        property1: "NewString"
    }));
};
function ChildComponent({ property1  }) {
    return React.createElement("span", null, property1);
}
