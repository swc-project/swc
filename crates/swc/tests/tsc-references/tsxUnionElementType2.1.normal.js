//// [file.tsx]
function SFC1(prop) {
    return /*#__PURE__*/ React.createElement("div", null, "hello");
}
;
function SFC2(prop) {
    return /*#__PURE__*/ React.createElement("h1", null, "World ");
}
var SFCComp = SFC1 || SFC2;
/*#__PURE__*/ React.createElement(SFCComp, {
    x: "hi"
});
export { };
