// @filename: 0.tsx
///<reference path="declaration.d.ts" />
import * as cx from 'classnames';
import * as React from "react";
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
let buttonProps;
let k = /*#__PURE__*/ React.createElement("button", _extends({
}, buttonProps), /*#__PURE__*/ React.createElement("span", {
    className: cx('class1', {
        class2: true
    })
}));
