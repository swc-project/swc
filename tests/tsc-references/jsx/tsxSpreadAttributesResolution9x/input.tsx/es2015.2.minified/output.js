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
class Opt extends React.Component {
    render() {
        return React.createElement("div", null, "Hello");
    }
}
const obj1 = {
    x: 2
};
React.createElement(Opt, null), React.createElement(Opt, _extends({
}, {
})), React.createElement(Opt, _extends({
}, obj1)), React.createElement(Opt, _extends({
}, obj1, {
    y: !0
})), React.createElement(Opt, {
    x: 2
});
export { };
