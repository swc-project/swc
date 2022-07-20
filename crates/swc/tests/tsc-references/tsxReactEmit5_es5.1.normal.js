//@jsx: react
//@module: commonjs
//@filename: file.tsx
import _extends from "@swc/helpers/src/_extends.mjs";
//@filename: test.d.ts
export var React;
//@filename: react-consumer.tsx
import { React } from "./test";
// Should emit test_1.React.createElement
//  and React.__spread
var foo;
var spread1 = /*#__PURE__*/ React.createElement("div", _extends({
    x: ""
}, foo, {
    y: ""
}));
