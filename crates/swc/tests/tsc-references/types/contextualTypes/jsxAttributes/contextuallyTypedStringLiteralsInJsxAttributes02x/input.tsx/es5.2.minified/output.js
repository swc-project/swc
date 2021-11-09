function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
var React = require("react");
export function MainButton(props) {
    return props.goTo ? this._buildMainLink(props) : this._buildMainButton(props);
}
React.createElement(MainButton, _extends({
}, {
    onClick: function(k) {
        console.log(k);
    }
}, {
    extra: !0
})), React.createElement(MainButton, {
    onClick: function(k) {
        console.log(k);
    },
    extra: !0
}), React.createElement(MainButton, _extends({
}, {
    goTo: "home"
}, {
    extra: !0
})), React.createElement(MainButton, {
    goTo: "home",
    extra: !0
});
export function NoOverload() {
}
React.createElement(NoOverload, _extends({
}, {
    onClick: function(k) {
        console.log(k);
    }
}, {
    extra: !0
}));
export function NoOverload1() {
}
React.createElement(NoOverload1, _extends({
}, {
    goTo: "home"
}, {
    extra: !0
}));
