import * as swcHelpers from "@swc/helpers";
require("react");
let obj0 = {
    to: "world"
}, obj3;
export function MainButton(props) {
    return props.to ? this._buildMainLink(props) : this._buildMainButton(props);
}
swcHelpers.extends({
    onClick: (e)=>{}
}, obj0), swcHelpers.extends({}, {
    to: "10000"
}, {
    onClick: ()=>{}
}), swcHelpers.extends({}, {
    to: "10000"
}, {
    onClick: (k)=>{}
}), swcHelpers.extends({}, obj3, {
    to: !0
}), swcHelpers.extends({}, {
    onClick (e) {}
}, obj0), swcHelpers.extends({}, {
    onClick (e) {}
}, {
    children: 10
}), swcHelpers.extends({}, {
    onClick (e) {}
}, {
    children: "hello",
    className: !0
});
