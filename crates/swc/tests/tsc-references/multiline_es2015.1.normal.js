// @filename: a.ts
// @filename: b.tsx
// @jsx: react
// @libFiles: react.d.ts,lib.d.ts
import * as React from "react";
export const texts = [];
/**
 @ts-ignore */ texts.push(100);
/**
 @ts-expect-error */ texts.push(100);
/**
 @ts-expect-error */ texts.push("100");
export function MyComponent(props) {
    return /*#__PURE__*/ React.createElement("div", null);
}
let x = /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement(MyComponent, {
    foo: 100
}), /*#__PURE__*/ React.createElement(MyComponent, {
    foo: 100
}), /*#__PURE__*/ React.createElement(MyComponent, {
    foo: 100
}), /*#__PURE__*/ React.createElement(MyComponent, {
    foo: 100
}), /*#__PURE__*/ React.createElement(MyComponent, {
    foo: 100
}), /*#__PURE__*/ React.createElement(MyComponent, {
    foo: 100
}), /*#__PURE__*/ React.createElement(MyComponent, {
    foo: "hooray"
}));
