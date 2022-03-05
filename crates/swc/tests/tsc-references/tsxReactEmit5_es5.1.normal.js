import * as swcHelpers from "@swc/helpers";
//@filename: react-consumer.tsx
import { React } from "./test";
//@filename: test.d.ts
export var React;
// Should emit test_1.React.createElement
//  and React.__spread
var foo;
var spread1 = /*#__PURE__*/ React.createElement("div", swcHelpers.extends({
    x: ""
}, foo, {
    y: ""
}));
