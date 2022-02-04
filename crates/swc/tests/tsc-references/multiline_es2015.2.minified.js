import * as React from "react";
export const texts = [];
texts.push(100), texts.push(100), texts.push("100");
export function MyComponent() {
    return React.createElement("div", null);
}
React.createElement("div", null, React.createElement(MyComponent, {
    foo: 100
}), React.createElement(MyComponent, {
    foo: 100
}), React.createElement(MyComponent, {
    foo: 100
}), React.createElement(MyComponent, {
    foo: 100
}), React.createElement(MyComponent, {
    foo: 100
}), React.createElement(MyComponent, {
    foo: 100
}), React.createElement(MyComponent, {
    foo: "hooray"
}));
