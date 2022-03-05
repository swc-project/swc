import * as swcHelpers from "@swc/helpers";
const React = require("react"), obj1 = {
    x: 2
};
class OverWriteAttr extends React.Component {
    render() {
        return React.createElement("div", null, "Hello");
    }
}
let anyobj;
React.createElement(OverWriteAttr, swcHelpers.extends({}, {}, {
    y: !0,
    overwrite: "hi"
}, obj1)), React.createElement(OverWriteAttr, swcHelpers.extends({}, obj1, {
    y: !0,
    overwrite: "hi"
})), React.createElement(OverWriteAttr, swcHelpers.extends({
    x: 3,
    overwrite: "hi"
}, obj1, {
    y: !0
})), React.createElement(OverWriteAttr, swcHelpers.extends({
    overwrite: "hi"
}, obj1, {
    x: 3
}, {
    y: !0,
    x: 2,
    overwrite: "world"
})), React.createElement(OverWriteAttr, swcHelpers.extends({}, {
    x: 2
}, {
    overwrite: "world"
}, {
    y: !0
})), React.createElement(OverWriteAttr, swcHelpers.extends({}, anyobj));
