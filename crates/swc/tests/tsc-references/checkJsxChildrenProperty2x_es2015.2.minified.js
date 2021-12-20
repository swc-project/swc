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
function Comp(p) {
    return React.createElement("div", null, p.b);
}
React.createElement(Comp, {
    a: 10,
    b: "hi"
}), React.createElement(Comp, {
    a: 10,
    b: "hi",
    children: "Random"
}, "hi hi hi!"), React.createElement(Comp, _extends({
    a: 10,
    b: "hi"
}, {
    children: "Random"
}), "hi hi hi!"), React.createElement(Comp, {
    a: 10,
    b: "hi"
}, React.createElement("div", null, " My Div "), (name)=>React.createElement("div", null, " My name ", name, " ")
), React.createElement(Comp, {
    a: 10,
    b: "hi"
}, React.createElement("div", null, " My Div "), 1000000), React.createElement(Comp, {
    a: 10,
    b: "hi"
}, React.createElement("div", null, " My Div "), "hi hi hi!"), React.createElement(Comp, {
    a: 10,
    b: "hi"
}, React.createElement("div", null, " My Div "), React.createElement("div", null, " My Div "));
export { };
