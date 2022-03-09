import * as swcHelpers from "@swc/helpers";
require("react");
export function MainButton(props) {
    return props.goTo ? this._buildMainLink(props) : this._buildMainButton(props);
}
swcHelpers.extends({}, {
    onClick: (k)=>{
        console.log(k);
    }
}, {
    extra: !0
}), swcHelpers.extends({}, {
    goTo: "home"
}, {
    extra: !0
});
export function NoOverload() {}
swcHelpers.extends({}, {
    onClick: (k)=>{
        console.log(k);
    }
}, {
    extra: !0
});
export function NoOverload1() {}
swcHelpers.extends({}, {
    goTo: "home"
}, {
    extra: !0
});
