import * as swcHelpers from "@swc/helpers";
require("react");
let obj = {
    children: "hi",
    to: "boo"
}, obj1;
export function MainButton(props) {
    return props.to ? this._buildMainLink(props) : this._buildMainButton(props);
}
swcHelpers.extends({}, obj), swcHelpers.extends({}, {
    to: 10000
}, obj), swcHelpers.extends({}, obj1), swcHelpers.extends({}, obj1, {
    to: "/to/somewhere"
}), swcHelpers.extends({}, {
    onClick: ()=>{}
}), swcHelpers.extends({}, {
    onClick: ()=>{
        console.log("hi");
    }
}), swcHelpers.extends({}, {
    onClick () {}
}), (e)=>{};
