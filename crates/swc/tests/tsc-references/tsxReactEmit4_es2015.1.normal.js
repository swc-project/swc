import * as swcHelpers from "@swc/helpers";
var p;
var openClosed1 = /*#__PURE__*/ React.createElement("div", null, blah);
// Should emit React.__spread({}, p, {x: 0})
var spread1 = /*#__PURE__*/ React.createElement("div", swcHelpers.extends({}, p, {
    x: 0
}));
