import * as swcHelpers from "@swc/helpers";
const React = require("react");
let obj = {
    children: "hi",
    to: "boo"
}, obj1;
export function MainButton(props) {
    return props.to ? this._buildMainLink(props) : this._buildMainButton(props);
}
React.createElement(MainButton, {
    to: "/some/path"
}, "GO"), React.createElement(MainButton, {
    onClick: (e)=>{}
}, "Hello world"), React.createElement(MainButton, swcHelpers.extends({}, obj)), React.createElement(MainButton, swcHelpers.extends({}, {
    to: 10000
}, obj)), React.createElement(MainButton, swcHelpers.extends({}, obj1)), React.createElement(MainButton, swcHelpers.extends({}, obj1, {
    to: "/to/somewhere"
})), React.createElement(MainButton, swcHelpers.extends({}, {
    onClick: ()=>{}
})), React.createElement(MainButton, swcHelpers.extends({}, {
    onClick: ()=>{
        console.log("hi");
    }
})), React.createElement(MainButton, swcHelpers.extends({}, {
    onClick () {}
})), React.createElement(MainButton, {
    to: "/some/path",
    "extra-prop": !0
}, "GO"), React.createElement(MainButton, {
    to: "/some/path",
    children: "hi"
}), React.createElement(MainButton, {
    onClick: (e)=>{},
    className: "hello",
    "data-format": !0
}, "Hello world"), React.createElement(MainButton, {
    "data-format": "Hello world"
});
