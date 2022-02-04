// @jsx: react
// @strict: true
// @esModuleInterop: true
/// <reference path="/.lib/react16.d.ts" />
import React from 'react';
export function ComponentWithUnion(props) {
    return(/*#__PURE__*/ React.createElement("h1", null));
}
// Usage with React tsx
export function HereIsTheError() {
    return(/*#__PURE__*/ React.createElement(ComponentWithUnion, {
        multi: false,
        value: 's',
        onChange: (val)=>console.log(val)
    }));
}
// Usage with pure TypeScript
ComponentWithUnion({
    multi: false,
    value: 's',
    onChange: (val)=>console.log(val) // <- this works fine
});
