//// [file.tsx]
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
var decorator = function decorator(props) {
    return /*#__PURE__*/ React.createElement(Component, props);
};
var decorator1 = function decorator1(props) {
    return /*#__PURE__*/ React.createElement(Component, _object_spread_props(_object_spread({}, props), {
        x: "hi"
    }));
};
export { };
