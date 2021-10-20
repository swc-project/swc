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
let obj0 = {
    to: "world"
}, obj3;
export function MainButton(props) {
    return props.to ? this._buildMainLink(props) : this._buildMainButton(props);
}
React.createElement(MainButton, {
    to: "/some/path",
    onClick: (e)=>{
    }
}, "GO"), React.createElement(MainButton, _extends({
    onClick: (e)=>{
    }
}, obj0), "Hello world"), React.createElement(MainButton, _extends({
}, {
    to: "10000"
}, {
    onClick: ()=>{
    }
})), React.createElement(MainButton, _extends({
}, {
    to: "10000"
}, {
    onClick: (k)=>{
    }
})), React.createElement(MainButton, _extends({
}, obj3, {
    to: !0
})), React.createElement(MainButton, _extends({
}, {
    onClick (e) {
    }
}, obj0)), React.createElement(MainButton, _extends({
}, {
    onClick (e) {
    }
}, {
    children: 10
})), React.createElement(MainButton, _extends({
}, {
    onClick (e) {
    }
}, {
    children: "hello",
    className: !0
})), React.createElement(MainButton, {
    "data-format": !0
});
