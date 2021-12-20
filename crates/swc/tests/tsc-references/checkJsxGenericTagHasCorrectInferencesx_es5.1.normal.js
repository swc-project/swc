// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
import * as React from "react";
var a = /*#__PURE__*/ React.createElement(GenericComponent, {
    initialValues: {
        x: "y"
    },
    nextValues: function(a1) {
        return a1;
    }
}); // No error
var b = /*#__PURE__*/ React.createElement(GenericComponent, {
    initialValues: 12,
    nextValues: function(a2) {
        return a2;
    }
}); // No error - Values should be reinstantiated with `number` (since `object` is a default, not a constraint)
var c = /*#__PURE__*/ React.createElement(GenericComponent, {
    initialValues: {
        x: "y"
    },
    nextValues: function(a3) {
        return {
            x: a3.x
        };
    }
}); // No Error
var d = /*#__PURE__*/ React.createElement(GenericComponent, {
    initialValues: {
        x: "y"
    },
    nextValues: function(a4) {
        return a4.x;
    }
}); // Error - `string` is not assignable to `{x: string}`
