import * as swcHelpers from "@swc/helpers";
var p1, p2, p3;
var spreads1 = /*#__PURE__*/ React.createElement("div", swcHelpers.extends({}, p1), p2);
var spreads2 = /*#__PURE__*/ React.createElement("div", swcHelpers.extends({}, p1), p2);
var spreads3 = /*#__PURE__*/ React.createElement("div", swcHelpers.extends({
    x: p3
}, p1), p2);
var spreads4 = /*#__PURE__*/ React.createElement("div", swcHelpers.extends({}, p1, {
    x: p3
}), p2);
var spreads5 = /*#__PURE__*/ React.createElement("div", swcHelpers.extends({
    x: p2
}, p1, {
    y: p3
}), p2);
