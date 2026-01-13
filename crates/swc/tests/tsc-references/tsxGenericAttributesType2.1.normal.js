//// [file.tsx]
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
var decorator4 = function decorator4(Component) {
    return function(props) {
        return /*#__PURE__*/ React.createElement(Component, _object_spread_props(_object_spread({}, props), {
            y: "blah"
        }));
    };
};
export { };
