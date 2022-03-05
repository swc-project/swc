import * as swcHelpers from "@swc/helpers";
const React = require("react");
let obj0 = {
    to: "world"
}, obj3;
export function MainButton(props) {
    return props.to ? this._buildMainLink(props) : this._buildMainButton(props);
}
React.createElement(MainButton, {
    to: "/some/path",
    onClick: (e)=>{}
}, "GO"), React.createElement(MainButton, swcHelpers.extends({
    onClick: (e)=>{}
}, obj0), "Hello world"), React.createElement(MainButton, swcHelpers.extends({}, {
    to: "10000"
}, {
    onClick: ()=>{}
})), React.createElement(MainButton, swcHelpers.extends({}, {
    to: "10000"
}, {
    onClick: (k)=>{}
})), React.createElement(MainButton, swcHelpers.extends({}, obj3, {
    to: !0
})), React.createElement(MainButton, swcHelpers.extends({}, {
    onClick (e) {}
}, obj0)), React.createElement(MainButton, swcHelpers.extends({}, {
    onClick (e) {}
}, {
    children: 10
})), React.createElement(MainButton, swcHelpers.extends({}, {
    onClick (e) {}
}, {
    children: "hello",
    className: !0
})), React.createElement(MainButton, {
    "data-format": !0
});
