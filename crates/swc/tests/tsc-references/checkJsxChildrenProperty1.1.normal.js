//// [file.tsx]
function Comp(p) {
    return /*#__PURE__*/ React.createElement("div", null, p.b);
}
// OK
var k = /*#__PURE__*/ React.createElement(Comp, {
    a: 10,
    b: "hi",
    children: "lol"
});
var k1 = /*#__PURE__*/ React.createElement(Comp, {
    a: 10,
    b: "hi"
}, "hi hi hi!");
var k2 = /*#__PURE__*/ React.createElement(Comp, {
    a: 10,
    b: "hi"
}, /*#__PURE__*/ React.createElement("div", null, "hi hi hi!"));
export { };
