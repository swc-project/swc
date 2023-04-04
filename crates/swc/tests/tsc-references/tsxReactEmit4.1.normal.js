//// [file.tsx]
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
var p;
var openClosed1 = /*#__PURE__*/ React.createElement("div", null, blah);
// Should emit React.__spread({}, p, {x: 0})
var spread1 = /*#__PURE__*/ React.createElement("div", _object_spread_props(_object_spread({}, p), {
    x: 0
}));
