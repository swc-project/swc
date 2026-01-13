//// [file.tsx]
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
export default function Component(props) {
    var condition1;
    if (condition1) {
        return /*#__PURE__*/ React.createElement(ChildComponent, props);
    } else {
        return /*#__PURE__*/ React.createElement(ChildComponent, _object_spread_props(_object_spread({}, props), {
            property1: "NewString"
        }));
    }
}
function ChildComponent(param) {
    var property1 = param.property1;
    return /*#__PURE__*/ React.createElement("span", null, property1);
}
