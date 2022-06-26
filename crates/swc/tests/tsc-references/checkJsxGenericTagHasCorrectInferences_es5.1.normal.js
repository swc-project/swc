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
    nextValues: function(a) {
        return a;
    }
}); // No error
var b = /*#__PURE__*/ React.createElement(GenericComponent, {
    initialValues: 12,
    nextValues: function(a) {
        return a;
    }
}); // No error - Values should be reinstantiated with `number` (since `object` is a default, not a constraint)
var c = /*#__PURE__*/ React.createElement(GenericComponent, {
    initialValues: {
        x: "y"
    },
    nextValues: function(a) {
        return {
            x: a.x
        };
    }
}); // No Error
var d = /*#__PURE__*/ React.createElement(GenericComponent, {
    initialValues: {
        x: "y"
    },
    nextValues: function(a) {
        return a.x;
    }
}); // Error - `string` is not assignable to `{x: string}`
