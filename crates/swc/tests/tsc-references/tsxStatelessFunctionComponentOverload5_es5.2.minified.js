import * as swcHelpers from "@swc/helpers";
var obj3, React = require("react"), obj0 = {
    to: "world"
};
export function MainButton(props) {
    return props.to ? this._buildMainLink(props) : this._buildMainButton(props);
}
React.createElement(MainButton, {
    to: "/some/path",
    onClick: function(e) {}
}, "GO"), React.createElement(MainButton, swcHelpers.extends({
    onClick: function(e) {}
}, obj0), "Hello world"), React.createElement(MainButton, swcHelpers.extends({}, {
    to: "10000"
}, {
    onClick: function() {}
})), React.createElement(MainButton, swcHelpers.extends({}, {
    to: "10000"
}, {
    onClick: function(k) {}
})), React.createElement(MainButton, swcHelpers.extends({}, obj3, {
    to: !0
})), React.createElement(MainButton, swcHelpers.extends({}, {
    onClick: function(e) {}
}, obj0)), React.createElement(MainButton, swcHelpers.extends({}, {
    onClick: function(e) {}
}, {
    children: 10
})), React.createElement(MainButton, swcHelpers.extends({}, {
    onClick: function(e) {}
}, {
    children: "hello",
    className: !0
})), React.createElement(MainButton, {
    "data-format": !0
});
