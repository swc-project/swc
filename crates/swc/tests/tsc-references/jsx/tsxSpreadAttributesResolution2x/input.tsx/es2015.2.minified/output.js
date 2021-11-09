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
class Poisoned extends React.Component {
    render() {
        return React.createElement("div", null, "Hello");
    }
}
React.createElement(Poisoned, _extends({
}, {
    x: "ok",
    y: "2"
})), React.createElement(Poisoned, _extends({
}, {
})), React.createElement(Poisoned, null), React.createElement(Poisoned, {
    x: !0,
    y: !0
}), React.createElement(Poisoned, _extends({
}, {
    x: 5,
    y: "2"
})), React.createElement(Poisoned, _extends({
}, {
    x: 5,
    y: "2"
}, {
    X: "hi"
}));
export { };
