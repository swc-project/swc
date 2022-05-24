import _extends from "@swc/helpers/lib/_extends.js";
require("react");
export function MainButton(props) {
    return props.goTo ? this._buildMainLink(props) : this._buildMainButton(props);
}
_extends({}, {
    onClick: function(k) {
        console.log(k);
    }
}, {
    extra: !0
}), _extends({}, {
    goTo: "home"
}, {
    extra: !0
});
export function NoOverload() {}
_extends({}, {
    onClick: function(k) {
        console.log(k);
    }
}, {
    extra: !0
});
export function NoOverload1() {}
_extends({}, {
    goTo: "home"
}, {
    extra: !0
});
