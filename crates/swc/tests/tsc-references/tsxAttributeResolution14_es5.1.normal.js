//@jsx: preserve
//@module: amd
//@filename: react.d.ts
function VerticalNavMenuItem(prop) {
    return /*#__PURE__*/ React.createElement("div", null, "props.primaryText");
}
function VerticalNav() {
    return /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement(VerticalNavMenuItem, {
        primaryText: 2
    }), "  // error", /*#__PURE__*/ React.createElement(VerticalNavMenuItem, {
        justRandomProp: 2,
        primaryText: "hello"
    }), "  // ok", /*#__PURE__*/ React.createElement(VerticalNavMenuItem, {
        justRandomProp1: true,
        primaryText: "hello"
    }), "  // error");
}
