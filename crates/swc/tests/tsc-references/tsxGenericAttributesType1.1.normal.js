//// [file.tsx]
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
var decorator = function decorator(Component) {
    return function(props) {
        return /*#__PURE__*/ React.createElement(Component, props);
    };
};
var decorator2 = function decorator2(Component) {
    return function(props) {
        return /*#__PURE__*/ React.createElement(Component, _object_spread_props(_object_spread({}, props), {
            x: 2
        }));
    };
};
var decorator3 = function decorator3(Component) {
    return function(props) {
        return /*#__PURE__*/ React.createElement(Component, _object_spread({
            x: 2
        }, props));
    };
};
export { };
