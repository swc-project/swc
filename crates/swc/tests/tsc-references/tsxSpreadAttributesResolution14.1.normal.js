//// [file.tsx]
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
export default function Component(props) {
    return(// Error extra property
    /*#__PURE__*/ React.createElement(AnotherComponent, _object_spread_props(_object_spread({}, props), {
        Property1: true
    })));
}
function AnotherComponent(param) {
    var property1 = param.property1;
    return /*#__PURE__*/ React.createElement("span", null, property1);
}
