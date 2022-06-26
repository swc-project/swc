import _extends from "@swc/helpers/src/_extends.mjs";
// OK
var obj1 = {
    x: 'foo'
};
/*#__PURE__*/ React.createElement("test1", _extends({}, obj1));
// Error, x is not string
var obj2 = {
    x: 32
};
/*#__PURE__*/ React.createElement("test1", _extends({}, obj2));
// Error, x is missing
var obj3 = {
    y: 32
};
/*#__PURE__*/ React.createElement("test1", _extends({}, obj3));
// OK
var obj4 = {
    x: 32,
    y: 32
};
/*#__PURE__*/ React.createElement("test1", _extends({}, obj4, {
    x: "ok"
}));
// Error
var obj5 = {
    x: 32,
    y: 32
};
/*#__PURE__*/ React.createElement("test1", _extends({
    x: "ok"
}, obj5));
// Ok
var obj6 = {
    x: 'ok',
    y: 32,
    extra: 100
};
/*#__PURE__*/ React.createElement("test1", _extends({}, obj6));
// OK (spread override)
var obj7 = {
    x: 'foo'
};
/*#__PURE__*/ React.createElement("test1", _extends({
    x: 32
}, obj7));
