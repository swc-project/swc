//// [correctlyMarkAliasAsReferences3.tsx]
//// [declaration.d.ts]
//// [0.tsx]
///<reference path="declaration.d.ts" />
import * as cx from 'classnames';
import * as React from "react";
let buttonProps;
let k = /*#__PURE__*/ React.createElement("button", buttonProps, /*#__PURE__*/ React.createElement("span", {
    className: cx('class1', {
        class2: true
    })
}));
