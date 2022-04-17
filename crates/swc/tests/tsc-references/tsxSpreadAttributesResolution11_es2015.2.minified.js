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
}, obj1), swcHelpers.extends({}, obj1, {
    y: !0,
    overwrite: "hi"
}), swcHelpers.extends({
    x: 3,
    overwrite: "hi"
}, obj1, {
    y: !0
}), swcHelpers.extends({
    overwrite: "hi"
}, obj1, {
    x: 3
}, {
    y: !0,
    x: 2,
    overwrite: "world"
}), swcHelpers.extends({}, {
    x: 2
}, {
    overwrite: "world"
}, {
    y: !0
}), swcHelpers.extends({}, anyobj);
