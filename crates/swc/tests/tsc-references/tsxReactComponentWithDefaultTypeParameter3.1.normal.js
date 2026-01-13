//// [file.tsx]
// Error
var x1 = /*#__PURE__*/ React.createElement(MyComp, null);
// OK
var x = /*#__PURE__*/ React.createElement(MyComp, {
    a: 10,
    b: "hi"
});
// Error
var x2 = /*#__PURE__*/ React.createElement(MyComp, {
    a: "hi"
});
export { };
