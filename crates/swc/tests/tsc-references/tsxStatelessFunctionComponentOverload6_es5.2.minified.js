import * as swcHelpers from "@swc/helpers";
require('react');
var obj1, obj = {
    children: "hi",
    to: "boo"
};
export function MainButton(props) {
    return props.to ? this._buildMainLink(props) : this._buildMainButton(props);
}
swcHelpers.extends({}, obj), swcHelpers.extends({}, {
    to: 10000
}, obj), swcHelpers.extends({}, obj1), swcHelpers.extends({}, obj1, {
    to: "/to/somewhere"
}), swcHelpers.extends({}, {
    onClick: function() {}
}), swcHelpers.extends({}, {
    onClick: function() {
        console.log("hi");
    }
}), swcHelpers.extends({}, {
    onClick: function() {}
});
