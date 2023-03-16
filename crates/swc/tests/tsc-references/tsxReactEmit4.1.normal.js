//// [file.tsx]
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
var p;
var openClosed1 = /*#__PURE__*/ React.createElement("div", null, blah);
// Should emit React.__spread({}, p, {x: 0})
var spread1 = /*#__PURE__*/ React.createElement("div", _object_spread_props(_object_spread({}, p), {
    x: 0
}));
