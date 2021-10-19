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
    x: "hello world",
    y: 2
}));
class EmptyProp extends React.Component {
    render() {
        return React.createElement("div", null, "Default hi");
    }
}
let j;
React.createElement(EmptyProp, _extends({
}, {
})), React.createElement(EmptyProp, _extends({
}, j)), React.createElement(EmptyProp, _extends({
}, {
    ref: (input)=>{
        this.textInput = input;
    }
})), React.createElement(EmptyProp, {
    "data-prop": !0
}), React.createElement(EmptyProp, _extends({
}, {
    "data-prop": !0
}));
export { };
