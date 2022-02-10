function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
import * as cx from "classnames";
import * as React from "react";
let buttonProps;
React.createElement("button", _extends({}, buttonProps, {
    className: cx("class1", {
        class2: !0
    })
}));
