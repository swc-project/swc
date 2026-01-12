//// [file.tsx]
import "@swc/helpers/_/_call_super";
import "@swc/helpers/_/_class_call_check";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import "@swc/helpers/_/_inherits";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
var _obj, obj1 = {
    x: 2
};
/*#__PURE__*/ React.Component, _object_spread(_object_spread_props(_object_spread({}, {}), {
    y: !0,
    overwrite: "hi"
}), obj1), _object_spread({}, obj1, {
    y: !0,
    overwrite: "hi"
}), _object_spread_props(_object_spread({
    x: 3,
    overwrite: "hi"
}, obj1), {
    y: !0
}), _object_spread_props(_object_spread({
    overwrite: "hi"
}, obj1), (_define_property(_obj = {
    x: 3,
    y: !0
}, "x", 2), _define_property(_obj, "overwrite", "world"), _obj));
