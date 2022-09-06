//// [a.ts]
export var texts = [];
/**
 @ts-ignore */ texts.push(100);
/**
 @ts-expect-error */ texts.push(100);
/**
 @ts-expect-error */ texts.push("100");
//// [b.tsx]
import * as React from "react";
export function MyComponent(props) {
    return /*#__PURE__*/ React.createElement("div", null);
}
var x = /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement(MyComponent, {
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
