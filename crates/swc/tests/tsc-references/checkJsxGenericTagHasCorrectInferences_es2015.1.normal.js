// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
import * as React from "react";
let a = /*#__PURE__*/ React.createElement(GenericComponent, {
    initialValues: {
        x: "y"
    },
    nextValues: (a)=>a
}); // No error
let b = /*#__PURE__*/ React.createElement(GenericComponent, {
    initialValues: 12,
    nextValues: (a)=>a
}); // No error - Values should be reinstantiated with `number` (since `object` is a default, not a constraint)
let c = /*#__PURE__*/ React.createElement(GenericComponent, {
    initialValues: {
        x: "y"
    },
    nextValues: (a)=>({
            x: a.x
        })
}); // No Error
let d = /*#__PURE__*/ React.createElement(GenericComponent, {
    initialValues: {
        x: "y"
    },
    nextValues: (a)=>a.x
}); // Error - `string` is not assignable to `{x: string}`
