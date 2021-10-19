function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
const React = require("react");
export default function Component(props) {
    return React.createElement(AnotherComponent, _extends({
    }, props, {
        Property1: !0
    }));
};
function AnotherComponent({ property1  }) {
    return React.createElement("span", null, property1);
}
