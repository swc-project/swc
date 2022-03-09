import * as swcHelpers from "@swc/helpers";
function make1(obj) {
    return /*#__PURE__*/ React.createElement("test1", swcHelpers.extends({}, obj)); // OK
}
function make2(obj) {
    return /*#__PURE__*/ React.createElement("test1", swcHelpers.extends({}, obj)); // Error (x is number, not string)
}
function make3(obj) {
    return /*#__PURE__*/ React.createElement("test1", swcHelpers.extends({}, obj)); // Error, missing x
}
/*#__PURE__*/ React.createElement("test1", swcHelpers.extends({}, {})); // Error, missing x
/*#__PURE__*/ React.createElement("test2", swcHelpers.extends({}, {})); // Error, missing toString
