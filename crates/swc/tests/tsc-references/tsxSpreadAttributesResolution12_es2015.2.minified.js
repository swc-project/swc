import * as swcHelpers from "@swc/helpers";
let React = require('react'), obj1 = {
    x: 2
};
class OverWriteAttr extends React.Component {
    render() {
        return React.createElement("div", null, "Hello");
    }
}
let anyobj;
swcHelpers.extends({}, {}, {
    y: !0,
    overwrite: "hi"
}, obj1), swcHelpers.extends({
    overwrite: "hi"
}, obj1, {
    x: 3
}, {
    y: !0
}), swcHelpers.extends({}, anyobj, {
    x: 3
}), swcHelpers.extends({
    overwrite: "hi"
}, obj1, {
    y: !0
});
