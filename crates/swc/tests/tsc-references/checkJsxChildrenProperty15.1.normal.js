//// [file.tsx]
var Tag = function(x) {
    return /*#__PURE__*/ React.createElement("div", null);
};
// OK
var k1 = /*#__PURE__*/ React.createElement(Tag, null);
var k2 = /*#__PURE__*/ React.createElement(Tag, null);
// Not OK (excess children)
var k3 = /*#__PURE__*/ React.createElement(Tag, {
    children: /*#__PURE__*/ React.createElement("div", null)
});
var k4 = /*#__PURE__*/ React.createElement(Tag, {
    key: "1"
}, /*#__PURE__*/ React.createElement("div", null));
var k5 = /*#__PURE__*/ React.createElement(Tag, {
    key: "1"
}, /*#__PURE__*/ React.createElement("div", null), /*#__PURE__*/ React.createElement("div", null));
export { };
