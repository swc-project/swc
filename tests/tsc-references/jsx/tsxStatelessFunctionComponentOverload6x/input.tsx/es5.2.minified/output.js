function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
var obj1, React = require("react"), obj = {
    children: "hi",
    to: "boo"
};
export function MainButton(props) {
    return props.to ? this._buildMainLink(props) : this._buildMainButton(props);
}
React.createElement(MainButton, {
    to: "/some/path"
}, "GO"), React.createElement(MainButton, {
    onClick: function(e) {
    }
}, "Hello world"), React.createElement(MainButton, _extends({
}, obj)), React.createElement(MainButton, _extends({
}, {
    to: 10000
}, obj)), React.createElement(MainButton, _extends({
}, obj1)), React.createElement(MainButton, _extends({
}, obj1, {
    to: "/to/somewhere"
})), React.createElement(MainButton, _extends({
}, {
    onClick: function() {
    }
})), React.createElement(MainButton, _extends({
}, {
    onClick: function() {
        console.log("hi");
    }
})), React.createElement(MainButton, _extends({
}, {
    onClick: function() {
    }
})), React.createElement(MainButton, {
    to: "/some/path",
    "extra-prop": !0
}, "GO"), React.createElement(MainButton, {
    to: "/some/path",
    children: "hi"
}), React.createElement(MainButton, {
    onClick: function(e) {
    },
    className: "hello",
    "data-format": !0
}, "Hello world"), React.createElement(MainButton, {
    "data-format": "Hello world"
});
