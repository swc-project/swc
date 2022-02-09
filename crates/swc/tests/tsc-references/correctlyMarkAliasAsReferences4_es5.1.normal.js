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
// @filename: 0.tsx
///<reference path="declaration.d.ts" />
import * as cx from 'classnames';
import * as React from "react";
var buttonProps;
var k = /*#__PURE__*/ React.createElement("button", _extends({}, buttonProps, {
    className: cx('class1', {
        class2: true
    })
}));
