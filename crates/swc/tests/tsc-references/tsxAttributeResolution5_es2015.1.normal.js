import _extends from "@swc/helpers/src/_extends.mjs";
function make1(obj) {
    return /*#__PURE__*/ React.createElement("test1", _extends({}, obj)); // OK
}
function make2(obj) {
    return /*#__PURE__*/ React.createElement("test1", _extends({}, obj)); // Error (x is number, not string)
}
function make3(obj) {
    return /*#__PURE__*/ React.createElement("test1", _extends({}, obj)); // Error, missing x
}
/*#__PURE__*/ React.createElement("test1", _extends({}, {})); // Error, missing x
/*#__PURE__*/ React.createElement("test2", _extends({}, {})); // Error, missing toString
