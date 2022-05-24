import _extends from "@swc/helpers/lib/_extends.js";
let React = require('react'), obj1 = {
    x: 2
};
class OverWriteAttr extends React.Component {
    render() {
        return React.createElement("div", null, "Hello");
    }
}
let anyobj;
_extends({}, {}, {
    y: !0,
    overwrite: "hi"
}, obj1), _extends({
    overwrite: "hi"
}, obj1, {
    x: 3
}, {
    y: !0
}), _extends({}, anyobj, {
    x: 3
}), _extends({
    overwrite: "hi"
}, obj1, {
    y: !0
});
