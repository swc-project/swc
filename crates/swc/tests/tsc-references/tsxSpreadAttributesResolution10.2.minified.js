//// [file.tsx]
import "@swc/helpers/_/_call_super";
import "@swc/helpers/_/_class_call_check";
import "@swc/helpers/_/_inherits";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
/*#__PURE__*/ React.Component;
var obj1 = {
    x: 2
};
_object_spread_props(_object_spread({}, {}), {
    x: 3
}), _object_spread_props(_object_spread({}, obj1), {
    x: "Hi"
}), _object_spread_props(_object_spread({}, obj1), {
    x: 3
});
