import * as swcHelpers from "@swc/helpers";
let React = require('react');
class Opt extends React.Component {
    render() {
        return React.createElement("div", null, "Hello");
    }
}
let obj1 = {
    x: 2
};
swcHelpers.extends({}, {}, {
    x: 3
}), swcHelpers.extends({}, obj1, {
    x: "Hi"
}), swcHelpers.extends({}, obj1, {
    x: 3
});
