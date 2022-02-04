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
    nextValues: (a1)=>a1
}); // No error
let b = /*#__PURE__*/ React.createElement(GenericComponent, {
    initialValues: 12,
    nextValues: (a2)=>a2
}); // No error - Values should be reinstantiated with `number` (since `object` is a default, not a constraint)
let c = /*#__PURE__*/ React.createElement(GenericComponent, {
    initialValues: {
        x: "y"
    },
    nextValues: (a3)=>({
            x: a3.x
        })
}); // No Error
let d = /*#__PURE__*/ React.createElement(GenericComponent, {
    initialValues: {
        x: "y"
    },
    nextValues: (a4)=>a4.x
}); // Error - `string` is not assignable to `{x: string}`
