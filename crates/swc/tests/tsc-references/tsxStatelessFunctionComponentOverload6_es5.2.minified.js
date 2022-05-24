import _extends from "@swc/helpers/lib/_extends.js";
require("react");
var obj1, obj = {
    children: "hi",
    to: "boo"
};
export function MainButton(props) {
    return props.to ? this._buildMainLink(props) : this._buildMainButton(props);
}
_extends({}, obj), _extends({}, {
    to: 10000
}, obj), _extends({}, obj1), _extends({}, obj1, {
    to: "/to/somewhere"
}), _extends({}, {
    onClick: function() {}
}), _extends({}, {
    onClick: function() {
        console.log("hi");
    }
}), _extends({}, {
    onClick: function() {}
});
