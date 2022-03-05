import * as swcHelpers from "@swc/helpers";
// OK
var obj1 = {
    x: 'foo'
};
/*#__PURE__*/ React.createElement("test1", swcHelpers.extends({}, obj1));
// Error, x is not string
var obj2 = {
    x: 32
};
/*#__PURE__*/ React.createElement("test1", swcHelpers.extends({}, obj2));
// Error, x is missing
var obj3 = {
    y: 32
};
/*#__PURE__*/ React.createElement("test1", swcHelpers.extends({}, obj3));
// OK
var obj4 = {
    x: 32,
    y: 32
};
/*#__PURE__*/ React.createElement("test1", swcHelpers.extends({}, obj4, {
    x: "ok"
}));
// Error
var obj5 = {
    x: 32,
    y: 32
};
/*#__PURE__*/ React.createElement("test1", swcHelpers.extends({
    x: "ok"
}, obj5));
// Ok
var obj6 = {
    x: 'ok',
    y: 32,
    extra: 100
};
/*#__PURE__*/ React.createElement("test1", swcHelpers.extends({}, obj6));
// OK (spread override)
var obj7 = {
    x: 'foo'
};
/*#__PURE__*/ React.createElement("test1", swcHelpers.extends({
    x: 32
}, obj7));
