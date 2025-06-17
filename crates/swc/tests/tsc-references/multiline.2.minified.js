//// [a.ts]
export var texts = [];
texts.push(100), texts.push(100), texts.push("100");
//// [b.tsx]
import * as React from "react";
export function MyComponent(props) {
    return React.createElement("div", null);
}
