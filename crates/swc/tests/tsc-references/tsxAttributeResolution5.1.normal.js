//// [file.tsx]
function make1(obj) {
    return /*#__PURE__*/ React.createElement("test1", obj); // OK
}
function make2(obj) {
    return /*#__PURE__*/ React.createElement("test1", obj); // Error (x is number, not string)
}
function make3(obj) {
    return /*#__PURE__*/ React.createElement("test1", obj); // Error, missing x
}
/*#__PURE__*/ React.createElement("test1", {}); // Error, missing x
/*#__PURE__*/ React.createElement("test2", {}); // Error, missing toString
