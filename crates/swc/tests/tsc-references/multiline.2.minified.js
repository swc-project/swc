//// [a.ts]
export var texts = [];
/**
 @ts-ignore */ texts.push(100), /**
 @ts-expect-error */ texts.push(100), /**
 @ts-expect-error */ texts.push("100");
//// [b.tsx]
import * as React from "react";
export function MyComponent(props) {
    return /*#__PURE__*/ React.createElement("div", null);
}
