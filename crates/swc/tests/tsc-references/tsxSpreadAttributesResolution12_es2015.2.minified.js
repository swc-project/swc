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
}, obj1)), React.createElement(OverWriteAttr, swcHelpers.extends({
    overwrite: "hi"
}, obj1, {
    x: 3
}, {
    y: !0
})), React.createElement(OverWriteAttr, swcHelpers.extends({}, anyobj, {
    x: 3
})), React.createElement(OverWriteAttr, swcHelpers.extends({
    overwrite: "hi"
}, obj1, {
    y: !0
}));
