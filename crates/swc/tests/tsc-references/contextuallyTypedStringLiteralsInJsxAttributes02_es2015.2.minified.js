import * as swcHelpers from "@swc/helpers";
const React = require("react");
export function MainButton(props) {
    return props.goTo ? this._buildMainLink(props) : this._buildMainButton(props);
}
React.createElement(MainButton, swcHelpers.extends({}, {
    onClick: (k)=>{
        console.log(k);
    }
}, {
    extra: !0
})), React.createElement(MainButton, {
    onClick: (k)=>{
        console.log(k);
    },
    extra: !0
}), React.createElement(MainButton, swcHelpers.extends({}, {
    goTo: "home"
}, {
    extra: !0
})), React.createElement(MainButton, {
    goTo: "home",
    extra: !0
});
export function NoOverload() {}
React.createElement(NoOverload, swcHelpers.extends({}, {
    onClick: (k)=>{
        console.log(k);
    }
}, {
    extra: !0
}));
export function NoOverload1() {}
React.createElement(NoOverload1, swcHelpers.extends({}, {
    goTo: "home"
}, {
    extra: !0
}));
