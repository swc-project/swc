function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
const React = require("react"), obj1 = {
    x: 2
};
class OverWriteAttr extends React.Component {
    render() {
        return React.createElement("div", null, "Hello");
    }
}
let anyobj;
React.createElement(OverWriteAttr, _extends({
}, {
}, {
    y: !0,
    overwrite: "hi"
}, obj1)), React.createElement(OverWriteAttr, _extends({
    overwrite: "hi"
}, obj1, {
    x: 3
}, {
    y: !0
})), React.createElement(OverWriteAttr, _extends({
}, anyobj, {
    x: 3
})), React.createElement(OverWriteAttr, _extends({
    overwrite: "hi"
}, obj1, {
    y: !0
}));
export { };
