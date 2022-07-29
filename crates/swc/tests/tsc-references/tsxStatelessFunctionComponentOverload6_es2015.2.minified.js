import _extends from "@swc/helpers/src/_extends.mjs";
require('react');
let obj = {
    children: "hi",
    to: "boo"
}, obj1;
export function MainButton(props) {
    return props.to ? this._buildMainLink(props) : this._buildMainButton(props);
}
_extends({}, obj), _extends({}, {
    to: 10000
}, obj), _extends({}, obj1), _extends({}, obj1, {
    to: "/to/somewhere"
}), _extends({}, {
    onClick: ()=>{}
}), _extends({}, {
    onClick: ()=>{
        console.log("hi");
    }
}), _extends({}, {
    onClick () {}
});
