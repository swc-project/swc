function _extends() {
    _extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends.apply(this, arguments);
}
// @filename: file.tsx
// @jsx: preserve
// @module: amd
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require('react');
export function MainButton(props) {
    var linkProps = props;
    if (linkProps.goTo) {
        return this._buildMainLink(props);
    }
    return this._buildMainButton(props);
}
var b0 = /*#__PURE__*/ React.createElement(MainButton, _extends({
}, {
    onClick: function(k) {
        console.log(k);
    }
}, {
    extra: true
})); // k has type "left" | "right"
var b2 = /*#__PURE__*/ React.createElement(MainButton, {
    onClick: function(k) {
        console.log(k);
    },
    extra: true
}); // k has type "left" | "right"
var b3 = /*#__PURE__*/ React.createElement(MainButton, _extends({
}, {
    goTo: "home"
}, {
    extra: true
})); // goTo has type"home" | "contact"
var b4 = /*#__PURE__*/ React.createElement(MainButton, {
    goTo: "home",
    extra: true
}); // goTo has type "home" | "contact"
export function NoOverload(buttonProps) {
    return undefined;
}
var c1 = /*#__PURE__*/ React.createElement(NoOverload, _extends({
}, {
    onClick: function(k) {
        console.log(k);
    }
}, {
    extra: true
})); // k has type any
export function NoOverload1(linkProps) {
    return undefined;
}
var d1 = /*#__PURE__*/ React.createElement(NoOverload1, _extends({
}, {
    goTo: "home"
}, {
    extra: true
})); // goTo has type "home" | "contact"
