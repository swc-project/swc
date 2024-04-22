//// [file.tsx]
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
// OK
var obj1 = {
    x: 'foo'
};
/*#__PURE__*/ React.createElement("test1", obj1);
// Error, x is not string
var obj2 = {
    x: 32
};
/*#__PURE__*/ React.createElement("test1", obj2);
// Error, x is missing
var obj3 = {
    y: 32
};
/*#__PURE__*/ React.createElement("test1", obj3);
// OK
var obj4 = {
    x: 32,
    y: 32
};
/*#__PURE__*/ React.createElement("test1", _object_spread_props(_object_spread({}, obj4), {
    x: "ok"
}));
// Error
var obj5 = {
    x: 32,
    y: 32
};
/*#__PURE__*/ React.createElement("test1", _object_spread({
    x: "ok"
}, obj5));
// Ok
var obj6 = {
    x: 'ok',
    y: 32,
    extra: 100
};
/*#__PURE__*/ React.createElement("test1", obj6);
// OK (spread override)
var obj7 = {
    x: 'foo'
};
/*#__PURE__*/ React.createElement("test1", _object_spread({
    x: 32
}, obj7));
