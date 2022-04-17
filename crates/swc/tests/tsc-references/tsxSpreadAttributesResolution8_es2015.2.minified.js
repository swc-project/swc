import * as swcHelpers from "@swc/helpers";
let React = require('react'), obj1 = {
    x: 2
};
class OverWriteAttr extends React.Component {
    render() {
        return React.createElement("div", null, "Hello");
    }
}
swcHelpers.extends({}, {}, {
    y: !0,
    overwrite: "hi"
}, obj1), swcHelpers.extends({}, obj1, {
    y: !0,
    overwrite: "hi"
});
