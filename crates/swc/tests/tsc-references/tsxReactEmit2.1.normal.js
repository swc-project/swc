//// [file.tsx]
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
var p1, p2, p3;
var spreads1 = /*#__PURE__*/ React.createElement("div", p1, p2);
var spreads2 = /*#__PURE__*/ React.createElement("div", p1, p2);
var spreads3 = /*#__PURE__*/ React.createElement("div", _object_spread({
    x: p3
}, p1), p2);
var spreads4 = /*#__PURE__*/ React.createElement("div", _object_spread_props(_object_spread({}, p1), {
    x: p3
}), p2);
var spreads5 = /*#__PURE__*/ React.createElement("div", _object_spread_props(_object_spread({
    x: p2
}, p1), {
    y: p3
}), p2);
